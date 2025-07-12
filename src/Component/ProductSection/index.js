import { useState } from "react";
import { TrashIcon } from "../../icons";
import styles from "./ProductSection.module.scss";
import classNames from "classnames/bind";
import VariantInfo from "./BaseInfo";

const cx = classNames.bind(styles);

function ProductSection() {
  const [productBase, setProductBase] = useState({
    name: "",
    brand: "",
    category: "",
    des: "",
  });

  const [productVariant, setProductVariant] = useState([
    {
      optionId: "",
      optionValue: [""],
    },
  ]);

  const [productAttribute, setProductAttribute] = useState([
    {
      groupId: 0,
      groupAttribute: [
        {
          attributeId: 0,
          attributeValue: "",
        },
      ],
    },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(123);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={cx("product-form")}>
        <section className={cx("basic-section")}>
          <h1>Thông tin cơ bản</h1>
          <div className={cx("basic-container")}>
            <div className={cx("basic-container_1")}>
              <div className={cx("basic-sub_container_1")}>
                <div>
                  <label htmlFor="productName">Tên sản phẩm</label>
                  <input
                    type="text"
                    id="productName"
                    name="name"
                    placeholder="Nhập tên sản phẩm..."
                    required
                  />
                </div>
                <div>
                  <label htmlFor="brand">Hãng</label>
                  <select id="brand" name="brand-select">
                    <option value="">-- Vui lòng chọn một tùy chọn --</option>
                    <option value="apple">APPLE</option>
                    <option value="lg">LG</option>
                    <option value="sony">SONY</option>
                  </select>
                </div>
              </div>
              <div className={cx("basic-sub_container_2")}>
                <div>
                  <label htmlFor="category">Danh mục</label>
                  <select id="category" name="category-select">
                    <option value="">-- Vui lòng chọn một tùy chọn --</option>
                    <option value="tv">Tivi</option>
                    <option value="tulanh">Tủ lạnh</option>
                    <option value="maygiac">Máy Giặc</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="avatar">Ảnh đại diện</label>
                  <input
                    type="file"
                    id="avatar"
                    name="avatar"
                    multiple
                    accept="image/*"
                    required
                  />
                </div>
              </div>
            </div>
            <div className={cx("basic-container_2")}>
              <div>
                <label htmlFor="description">Mô tả</label>
                <textarea
                  name="product-description"
                  id="description"
                  rows="5"
                  cols="50"
                  placeholder="Nhập mô tả chi tiết sản phẩm..."
                ></textarea>
              </div>
            </div>
          </div>
        </section>

        <VariantInfo
          productVariant={productVariant}
          setProductVariant={setProductVariant}
          productName={productBase.name}
        />

        <section className={cx("attribute-section")}></section>
      </div>
      <button type="submit">Gửi</button>
      <button type="button">Clear</button>
    </form>
  );
}

export default ProductSection;
