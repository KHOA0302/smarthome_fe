import styles from "./CategorySection.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

function CategorySection() {
  return (
    <form>
      <div className={cx("category-form")}>
        <div>
          <h1>Thêm danh mục</h1>
        </div>
      </div>
    </form>
  );
}

export default CategorySection;
