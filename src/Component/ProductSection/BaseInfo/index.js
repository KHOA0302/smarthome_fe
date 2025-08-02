import styles from "./BaseInfo.module.scss";
import classNames from "classnames/bind";
import { useProductInfoFormGetContext } from "../../../Pages/Admin/ProductAdd";

const cx = classNames.bind(styles);
function BaseInfo({ productBase, setProductBase }) {
  const { brands, categories } = useProductInfoFormGetContext();

  const handleChange = (e) => {
    let newProduct;
    switch (e.target.name) {
      case "name":
        newProduct = {
          ...productBase,
          name: e.target.value,
        };
        setProductBase({ ...newProduct });
        break;
      case "brand":
        newProduct = {
          ...productBase,
          brand: e.target.value,
        };
        setProductBase({ ...newProduct });
        break;
      case "category":
        newProduct = {
          ...productBase,
          category: e.target.value,
        };
        setProductBase({ ...newProduct });
        break;
      case "img":
        newProduct = {
          ...productBase,
          imgs: [...Array.from(e.target.files)],
        };
        setProductBase({ ...newProduct });
        break;
      case "description":
        break;
    }
  };

  return (
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
                onChange={handleChange}
                placeholder="Nhập tên sản phẩm..."
                required
              />
            </div>
            <div>
              <label htmlFor="brand">Hãng</label>
              <select id="brand" name="brand" onChange={handleChange}>
                <option value="">-- Vui lòng chọn một tùy chọn --</option>
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
          <div className={cx("basic-sub_container_2")}>
            <div>
              <label htmlFor="category">Danh mục</label>
              <select id="category" name="category" onChange={handleChange}>
                <option value="">-- Vui lòng chọn một tùy chọn --</option>
                {categories.map((category, id) => {
                  return (
                    <option value={category.category_id} key={id}>
                      {category.category_name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label htmlFor="img">Ảnh đại diện</label>
              <input
                onChange={handleChange}
                type="file"
                id="img"
                name="img"
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
              name="description"
              id="description"
              rows="5"
              cols="50"
              placeholder="Nhập mô tả chi tiết sản phẩm..."
            ></textarea>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BaseInfo;
