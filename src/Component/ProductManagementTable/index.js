import { useEffect, useState } from "react";
import styles from "./ProductManagementTable.module.scss";
import classNames from "classnames/bind";
import { toast, ToastContainer } from "react-toastify";
import productService from "../../api/productService";
import ToggleBtn from "../ToggleBtn";
import { formatNumber } from "../../utils/formatNumber";

const cx = classNames.bind(styles);

function ProductManagementTable({
  productsDetail,
  onButton = false,
  numberDisplay = 7,
  loading,
}) {
  const [limitedShow, setLimitedShow] = useState(numberDisplay);

  const handleShowMore = () => {
    const fullShow = productsDetail.length;
    if (limitedShow < fullShow) {
      setLimitedShow(productsDetail.length);
    } else {
      setLimitedShow(numberDisplay);
    }
  };

  return (
    <div className={cx("wrapper")}>
      <div
        className={cx("container", {
          "show-more": !loading && limitedShow < productsDetail.length,
        })}
      >
        {limitedShow < productsDetail.length && (
          <button
            className={cx("show-more-btn")}
            onClick={handleShowMore}
          ></button>
        )}
        <div className={cx("product-table")}>
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th></th>
                <th>Tên Sản Phẩm</th>
                <th>Tùy Chọn</th>
                <th>Giá</th>
                <th>Tồn Kho</th>
                <th>Loại</th>
                <th>Hãng</th>
                <th>Dự Đoán Bán Chạy</th>
                <th>Ẩn</th>
              </tr>
            </thead>
            <tbody>
              {productsDetail.map((product, id) => {
                if (loading) return;
                if (id + 1 > limitedShow) return;
                const status =
                  product.item_status === "in_stock" ? true : false;
                return (
                  <tr key={id} className={cx({ outStock: !status })}>
                    <td>{id + 1}</td>
                    <td>
                      <div>
                        <img src={product.image_url} key={product.variant_id} />
                      </div>
                    </td>
                    <td>{product.variant_name}</td>
                    <td>
                      <div className={cx("product-option")}>
                        {product.selectedOptionValues.map((optionValue, id) => {
                          return (
                            <span key={id}>
                              {optionValue.option_value_name}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td>{formatNumber(parseInt(product.price))}VNĐ</td>
                    <td>{product.stock_quantity}</td>
                    <td>{product.product.category.category_name}</td>
                    <td>{product.product.brand.brand_name}</td>
                    <td>{product.predicted_order_next_quarter.toFixed(2)}</td>
                    <td>
                      <ToggleBtn active={status} onButton={onButton} />
                    </td>
                  </tr>
                );
              })}

              {loading && (
                <>
                  <tr className={cx("skeleton-loading")}>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr className={cx("skeleton-loading")}>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr className={cx("skeleton-loading")}>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr className={cx("skeleton-loading")}>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr className={cx("skeleton-loading")}>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
          {limitedShow === productsDetail.length && (
            <div className={cx("show-less-btn")} onClick={handleShowMore}>
              <span>show less</span>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ProductManagementTable;
