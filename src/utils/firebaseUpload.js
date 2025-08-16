import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../config/firebase";

export const uploadImageToFirebase = async (file, type) => {
  if (!file) {
    throw new Error("Không có file để tải lên.");
  }
  if (!["basic", "variant", "des", "brand", "category"].includes(type)) {
    throw new Error("Loại ảnh không hợp lệ.");
  }

  const fileExtension = file.name.split(".").pop();

  const uniqueFileName = `${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 15)}.${fileExtension}`;

  const fullPath = `product/${type}/${uniqueFileName}`;
  const storageRef = ref(storage, fullPath);

  try {
    const snapshot = await uploadBytes(storageRef, file);

    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Lỗi khi tải ảnh lên Firebase:", error);
    throw error;
  }
};

export const uploadMultipleImagesToFirebase = async (files, type) => {
  if (!files || files.length === 0) {
    return [];
  }

  const imageUrls = [];
  for (const file of files) {
    try {
      const url = await uploadImageToFirebase(file, type);
      imageUrls.push(url);
    } catch (error) {
      console.error(`Lỗi khi tải lên file ${file.name}:`, error);
    }
  }
  return imageUrls;
};

export const deleteImageFromFirebase = async (imageURL) => {
  console.log(imageURL);
  if (!imageURL) {
    throw new Error("URL ảnh không được rỗng.");
  }

  try {
    const decodedURL = decodeURIComponent(imageURL);
    const storagePath = decodedURL.split("/o/")[1].split("?")[0];
    const imageRef = ref(storage, storagePath);
    await deleteObject(imageRef);

    console.log("Ảnh đã được xóa thành công!");
    return true;
  } catch (error) {
    console.error("Lỗi khi xóa ảnh từ Firebase:", error);
    throw error;
  }
};
