import { useEffect, useState } from "react";
import { brandService } from "../../api/brandService";
import styles from "./ProductInfoEdit.module.scss";
import classNames from "classnames/bind";
import productService from "../../api/productService";
import { toast, ToastContainer } from "react-toastify";

const cx = classNames.bind(styles);
function ProductInfoEdit({ productInfo, dispatch }) {
  const [brands, setBrands] = useState([]);
  const [activeEdit, setActiveEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchBrand = async () => {
    try {
      const res = await brandService.getAllBrands();
      setBrands(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBrand();
  }, []);

  const handleDispatch = (type, payload) => {
    if (!activeEdit) return;
    dispatch({ type: type, payload: payload });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const promise = productService.editProductInfo(productInfo);

    toast.promise(promise, {
      pending: "Đang cập nhật sản phẩm...",
      success: "Cập nhật sản phẩm thành công!",
      error: "Cập nhật sản phẩm thất bại!",
    });

    promise
      .then((res) => {
        console.log("Cập nhật thành công, dữ liệu trả về:", res);
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật:", error);
      });
  };

  console.log(productInfo);

  return (
    <form className={cx("wrapper")} onSubmit={handleSubmit}>
      <div className={cx("container")}>
        <div className={cx("title")}>
          <h2>Thông tin cơ bản</h2>
          <button
            className={cx({ active: activeEdit })}
            onClick={() => setActiveEdit(!activeEdit)}
            type="button"
          >
            SỬA
          </button>
        </div>
        <div className={cx("product")}>
          <div className={cx("product-name")}>
            <input
              value={productInfo.product_name}
              onChange={(e) =>
                handleDispatch("EDIT_PRODUCT_NAME", e.target.value)
              }
            />
          </div>
          <div className={cx("product-brand")}>
            <select
              id="brand"
              value={productInfo.brand_id}
              onChange={(e) =>
                handleDispatch("EDIT_PRODUCT_BRAND", parseInt(e.target.value))
              }
            >
              {brands.map((brand, id) => {
                return (
                  <option value={brand.brand_id} key={id}>
                    {brand.brand_name.toUpperCase()}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        {activeEdit && (
          <button type="submit" className={cx("submit-btn")}>
            SUBMIT
          </button>
        )}
      </div>
      <ToastContainer />
    </form>
  );
}

export default ProductInfoEdit;
