import styles from "./BrandSection.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

function BrandSection() {
  return (
    <form>
      <div className={cx("brand-form")}></div>
    </form>
  );
}

export default BrandSection;
