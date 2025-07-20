// src/utils/firebaseUpload.js

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase"; // Import instance storage từ file cấu hình Firebase của bạn

/**
 * Tải một file ảnh lên Firebase Storage và trả về URL công khai.
 *
 * @param {File} file - Đối tượng File từ input.
 * @param {'basic' | 'variant' | 'des'} type - Loại ảnh để xác định thư mục con ('basic', 'variant', 'des').
 * @param {string} identifier - Một chuỗi định danh duy nhất cho sản phẩm/biến thể (ví dụ: product ID, SKU, hoặc tạm thời là timestamp/UUID)
 * để tạo thư mục con bên trong 'basic', 'variant', 'des'.
 * @returns {Promise<string>} URL công khai của ảnh.
 */
export const uploadImageToFirebase = async (file, type, identifier) => {
  if (!file) {
    throw new Error("Không có file để tải lên.");
  }
  if (!["basic", "variant", "des", "brand"].includes(type)) {
    throw new Error("Loại ảnh không hợp lệ.");
  }

  const fileExtension = file.name.split(".").pop();
  // Tạo tên file duy nhất bằng timestamp và một chuỗi ngẫu nhiên
  const uniqueFileName = `${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 15)}.${fileExtension}`;

  // Xây dựng đường dẫn đầy đủ: product/{type}/{uniqueFileName}
  const fullPath = `product/${type}/${uniqueFileName}`;
  const storageRef = ref(storage, fullPath);

  try {
    // Tải file lên Firebase Storage
    const snapshot = await uploadBytes(storageRef, file);
    // Lấy URL công khai của file vừa tải lên
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Lỗi khi tải ảnh lên Firebase:", error);
    throw error; // Ném lỗi để component gọi có thể bắt và xử lý
  }
};

/**
 * Tải nhiều file ảnh lên Firebase Storage và trả về mảng các URL công khai.
 *
 * @param {Array<File>} files - Mảng các đối tượng File.
 * @param {'basic' | 'variant' | 'des'} type - Loại ảnh để xác định thư mục con ('basic', 'variant', 'des').
 * @param {string} identifier - Một chuỗi định danh duy nhất cho sản phẩm/biến thể.
 * @returns {Promise<Array<string>>} Mảng các URL công khai của ảnh.
 */
export const uploadMultipleImagesToFirebase = async (
  files,
  type,
  identifier
) => {
  if (!files || files.length === 0) {
    return [];
  }

  const imageUrls = [];
  for (const file of files) {
    try {
      // Sử dụng hàm uploadImageToFirebase đã điều chỉnh
      const url = await uploadImageToFirebase(file, type, identifier);
      imageUrls.push(url);
    } catch (error) {
      console.error(`Lỗi khi tải lên file ${file.name}:`, error);
      // Tùy chọn: ném lỗi hoặc bỏ qua file bị lỗi
      // Nếu ném lỗi: throw error;
      // Nếu bỏ qua: continue;
    }
  }
  return imageUrls;
};
