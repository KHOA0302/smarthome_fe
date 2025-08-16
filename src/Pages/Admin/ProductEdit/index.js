import styles from "./ProductEdit.module.scss";
import classNames from "classnames/bind";
import ProductEditSection from "../../../Component/ProductEditSection";

const cx = classNames.bind(styles);
function ProductEdit() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <ProductEditSection />
      </div>
    </div>
  );
}

export default ProductEdit;
