import styles from "./CategorySection.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

function CategorySection() {
  return (
    <form>
      <div className={cx("category-form")}></div>
    </form>
  );
}

export default CategorySection;
