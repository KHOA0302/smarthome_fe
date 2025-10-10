import { useRef, useState } from "react";
import { PlusIcon, TrashIcon } from "../../icons";
import styles from "./ProductImgEdit.module.scss";
import classNames from "classnames/bind";
import {
  deleteImageFromFirebase,
  uploadImageToFirebase,
} from "../../utils/firebaseUpload";
import productService from "../../api/productService";
import { useParams } from "react-router";
import { toast, ToastContainer } from "react-toastify";
const cx = classNames.bind(styles);
function ProductImgsEdit({ productImgs, dispatch, reFetch }) {
  const fileInputRef = useRef(null);
  const { productId } = useParams();
  const [activeEdit, setActiveEdit] = useState(false);
  const handleDispatch = (type, payload) => {
    if (!activeEdit) return;
    dispatch({ type: type, payload: payload });
  };

  const handleAddImageClick = () => {
    if (!activeEdit) return;
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    let displayOrder =
      productImgs.length > 0
        ? productImgs[productImgs.length - 1].display_order
        : 100000;
    if (files.length > 0) {
      files.forEach((file) => {
        const tempImageUrl = URL.createObjectURL(file);
        displayOrder += 100000;

        dispatch({
          type: "ADD_TEMP_IMG",
          payload: {
            img_id: `temp-${Date.now()}-${Math.random()}`,
            image_url: tempImageUrl,
            file: file,
            isRemove: false,
            display_order: displayOrder,
          },
        });
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const promiseToast = new Promise(async (resolve, reject) => {
      let updateProductImgs;
      try {
        updateProductImgs = await Promise.all(
          productImgs.map(async (img) => {
            if (!img.isRemove && img.file) {
              const imgUrlFirebase = await uploadImageToFirebase(
                img.file,
                "basic"
              );
              return {
                ...img,
                image_url: imgUrlFirebase,
                file: "",
              };
            }
            return img;
          })
        );

        const imgsToDelete = updateProductImgs.filter((img) => img.isRemove);

        const res = await productService.editProductImgs(
          productId,
          updateProductImgs
        );

        if (res.status === 200) {
          await Promise.all(
            imgsToDelete.map(async (img) => {
              if (typeof img.img_id === "number") {
                await deleteImageFromFirebase(img.image_url);
              }
            })
          );
        }

        resolve(res);
      } catch (error) {
        console.error(error);

        const newImgsUploaded = updateProductImgs.filter(
          (img) =>
            typeof img.img_id !== "number" &&
            !img.isRemove &&
            img.image_url.startsWith("http")
        );

        if (newImgsUploaded.length > 0) {
          await Promise.all(
            newImgsUploaded.map(async (img) => {
              try {
                await deleteImageFromFirebase(img.image_url);
              } catch (deleteError) {}
            })
          );
        }
        reject(error);
      }
    });

    toast.promise(promiseToast, {
      pending: "Đang cập nhật sản phẩm...",
      success: "Cập nhật sản phẩm thành công!",
      error: "Cập nhật sản phẩm thất bại! Vui lòng thử lại.",
    });
  };

  return (
    <form className={cx("wrapper")} onSubmit={handleSubmit}>
      <div className={cx("container")}>
        <div className={cx("title")}>
          <h2>Phần ảnh sản phẩm</h2>
          <button
            className={cx({ active: activeEdit })}
            onClick={() => setActiveEdit(!activeEdit)}
            type="button"
          >
            SỬA
          </button>
        </div>
        <div className={cx("imgs")}>
          <div className={cx("blank")}>
            {productImgs?.map((img, id) => {
              return (
                <div className={cx("img")} key={id}>
                  <div className={cx("img-wrapper", { remove: img.isRemove })}>
                    <img src={img.image_url} />
                    <button
                      type="button"
                      onClick={() => handleDispatch("DELETE_IMG", img.img_id)}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              );
            })}

            <button
              type="button"
              className={cx("img-add")}
              onClick={handleAddImageClick}
            >
              <PlusIcon />
            </button>
          </div>
        </div>
        {activeEdit && (
          <button type="submit" className={cx("submit-btn")}>
            SUBMIT
          </button>
        )}
      </div>

      <input
        type="file"
        multiple
        hidden
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
      />
      <ToastContainer />
    </form>
  );
}

export default ProductImgsEdit;
