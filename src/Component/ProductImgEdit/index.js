import { useRef } from "react";
import { PlusIcon, TrashIcon } from "../../icons";
import styles from "./ProductImgEdit.module.scss";
import classNames from "classnames/bind";
import { uploadImageToFirebase } from "../../utils/firebaseUpload";
import productService from "../../api/productService";
import { useParams } from "react-router";
const cx = classNames.bind(styles);
function ProductImgsEdit({ productImgs, dispatch }) {
  const fileInputRef = useRef(null);
  const { productId } = useParams();

  const handleDispatch = (type, payload) => {
    dispatch({ type: type, payload: payload });
  };

  const handleAddImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    let displayOrder = productImgs[productImgs.length - 1].display_order;
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
    const updateProductImgs = await Promise.all(
      productImgs.map(async (img) => {
        if (img.file) {
          const imgUrlFirebase = await uploadImageToFirebase(img.file, "basic");
          return {
            ...img,
            image_url: imgUrlFirebase,
            file: "",
          };
        }
        return img;
      })
    );

    const fetch = () => {
      try {
        const res = productService.editProductImgs(
          productId,
          updateProductImgs
        );
        console.log(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetch();
  };

  return (
    <form className={cx("wrapper")} onSubmit={handleSubmit}>
      <div className={cx("container")}>
        <h3>Phần ảnh sản phẩm</h3>
        <div className={cx("imgs")}>
          <button type="button">SỬA</button>
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
      </div>

      <input
        type="file"
        multiple
        hidden
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
      />
      <button type="submit">SUBMIT</button>
    </form>
  );
}

export default ProductImgsEdit;
