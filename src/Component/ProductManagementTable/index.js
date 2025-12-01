import { useEffect, useState } from "react";
import styles from "./ProductManagementTable.module.scss";
import classNames from "classnames/bind";
import { toast, ToastContainer } from "react-toastify";
import productService from "../../api/productService";
import ToggleBtn from "../ToggleBtn";

const cx = classNames.bind(styles);

function ProductManagementTable() {
  const [productsDetail, setProductsDetail] = useState();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await productService.getProductPrediction();
        setProductsDetail(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, []);

  console.log(productsDetail);

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
              <tr>
                <td>1</td>
                <td>ảnh</td>
                <td>Điện Thoại ABC Pro Max</td>
                <td>
                  <span>128GB</span>
                  <span>Đen</span>
                </td>
                <td>15.000.000 VNĐ</td>
                <td>150</td>
                <td>Di động</td>
                <td>TechCorp</td>
                <td>Có</td>
                <td>
                  <ToggleBtn active={true} />
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>ảnh</td>
                <td>Áo Thun Unisex Cotton</td>
                <td>
                  <span>Size L</span>
                  <span>Xanh</span>
                </td>
                <td>250.000 VNĐ</td>
                <td>500</td>
                <td>Thời trang</td>
                <td>FashionHub</td>
                <td>Không</td>
                <td>
                  <ToggleBtn active={false} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ProductManagementTable;
