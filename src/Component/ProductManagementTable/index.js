import { useEffect, useState } from "react";
import styles from "./ProductManagementTable.module.scss";
import classNames from "classnames/bind";
import { toast, ToastContainer } from "react-toastify";
import productService from "../../api/productService";
import ToggleBtn from "../ToggleBtn";
import { formatNumber } from "../../utils/formatNumber";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { SpecialArrowIcon } from "../../icons";

const cx = classNames.bind(styles);

const th9ByMode = ({ predictMode, editMode, promotionMode }) => {
  if (predictMode) return "Dự đoán bán chạy";
  if (editMode) return "Tộn tái";
  if (promotionMode) return "Tồn tại";
};

function ProductManagementTable({
  productsDetail,
  onButton = false,
  numberDisplay = 7,
  predictMode = false,
  editMode = false,
  promotionMode = false,
  handleCheckVariants = () => {},
  checkedVariant = [],
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

  const handleOnchangeCheckbox = (product) =>
    handleCheckVariants({
      id: product.variant_id,
      allowCheck: !!product?.promotionVariants[0]?.promotion,
    });

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
                <th>
                  {promotionMode ? (
                    <Tippy content="Bỏ chọn">
                      <button
                        className={cx("clear_check-btn")}
                        onClick={() => handleCheckVariants({ clear: true })}
                      >
                        CLEAR
                      </button>
                    </Tippy>
                  ) : (
                    "STT"
                  )}
                </th>
                <th></th>
                <th>Tên Sản Phẩm</th>
                <th>Tùy Chọn</th>
                <th>Giá</th>
                <th>Tồn Kho</th>
                <th>Loại</th>
                <th>Hãng</th>
                <th>{th9ByMode({ predictMode, editMode, promotionMode })}</th>
                <th>Ẩn</th>
              </tr>
            </thead>
            <tbody>
              {productsDetail.map((product, id) => {
                if (loading) return;
                if (id + 1 > limitedShow) return;
                const status =
                  product.item_status === "in_stock" ? true : false;
                const dateObject = new Date(product.created_at);
                const existedTime = `${
                  dateObject.getUTCMonth() + 1
                }/${dateObject.getUTCFullYear()}`;
                return (
                  <tr
                    key={id}
                    className={cx({
                      outStock: !status,
                      checked: checkedVariant?.includes(product.variant_id),
                    })}
                    onClick={() => handleOnchangeCheckbox(product)}
                  >
                    <td>
                      {editMode && predictMode && id + 1}
                      {promotionMode && (
                        <Tippy
                          content="sản phẩm đã được giảm giá"
                          disabled={!!!product?.promotionVariants[0]?.promotion}
                        >
                          <input
                            type="checkbox"
                            id={product.variant_id}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            onChange={(e) => handleOnchangeCheckbox(product)}
                            checked={checkedVariant.includes(
                              product.variant_id
                            )}
                            className={cx("variant-checkbox", {
                              disable:
                                !!product?.promotionVariants[0]?.promotion,
                            })}
                          />
                        </Tippy>
                      )}
                    </td>
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
                    <td>
                      <div className={cx("current-price")}>
                        <span
                          className={cx("price", {
                            ["apply-promotion"]:
                              !!product?.promotionVariants[0]?.promotion,
                          })}
                        >
                          {formatNumber(parseInt(product.price))}đ
                        </span>
                        {!!product?.promotionVariants[0]?.promotion && (
                          <span className={cx("discount")}>
                            <SpecialArrowIcon />{" "}
                            {parseInt(
                              product?.promotionVariants[0]?.promotion
                                .discount_value
                            )}
                            %
                          </span>
                        )}
                      </div>
                      {!!product?.promotionVariants[0]?.promotion && (
                        <div className={cx("discount-price")}>
                          <span>
                            {formatNumber(
                              parseInt(product.price) -
                                (parseInt(product.price) *
                                  parseInt(
                                    product?.promotionVariants[0]?.promotion
                                      .discount_value
                                  )) /
                                  100
                            )}
                            đ
                          </span>
                        </div>
                      )}
                    </td>
                    <td>{product.stock_quantity}</td>
                    <td>
                      {product.product.category.category_name.toUpperCase()}
                    </td>
                    <td>{product.product.brand.brand_name.toUpperCase()}</td>
                    <td>
                      {promotionMode && existedTime}
                      {predictMode &&
                        product?.predicted_order_next_quarter?.toFixed(2)}
                    </td>
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
