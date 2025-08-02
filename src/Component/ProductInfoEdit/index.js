import styles from "./ProductInfoEdit.module.scss";
import classNames from "classnames/bind";
import { useReducer } from "react";
import { initState, reducer } from "../../Pages/Admin/ProductEdit/reducer";
const cx = classNames.bind(styles);
function ProductInfoEdit({ productInfo, dispatch }) {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form className={cx("wrapper")} onSubmit={handleSubmit}>
      <div className={cx("container")}></div>
      <button type="submit">SUBMIT</button>
    </form>
  );
}

export default ProductInfoEdit;
