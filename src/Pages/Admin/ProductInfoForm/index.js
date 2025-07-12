import BrandSection from "../../../Component/BrandSection";
import CategorySection from "../../../Component/CategorySection";
import ProductSection from "../../../Component/ProductSection";
import styles from "./ProductInfoForm.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function ProductInfoForm() {
  return (
    <div className={cx("wrapper")}>
      <nav className={cx("navbar")}>
        <button>Sản phẩm</button>
        <button>Hãng</button>
        <button>Danh mục</button>
      </nav>
      <div className={cx("container")}>
        <ProductSection />

        <BrandSection />

        <CategorySection />
      </div>
    </div>
  );
}

export default ProductInfoForm;
