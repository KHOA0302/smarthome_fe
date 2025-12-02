import { useEffect, useState } from "react";
import styles from "./ProductManagementTable.module.scss";
import classNames from "classnames/bind";
import { toast, ToastContainer } from "react-toastify";
import productService from "../../api/productService";
import ToggleBtn from "../ToggleBtn";
import { formatNumber } from "../../utils/formatNumber";

const cx = classNames.bind(styles);

function ProductManagementTable({ productsDetail }) {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("product-filter")}></div>
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
                const status =
                  product.item_status === "in_stock" ? true : false;
                return (
                  <tr key={id} className={cx({ outStock: !status })}>
                    <td>{id + 1}</td>
                    <td>
                      <div>
                        <img src={product.image_url} />
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
                    <td>{product.stemp}</td>
                    <td>
                      <ToggleBtn active={status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ProductManagementTable;
