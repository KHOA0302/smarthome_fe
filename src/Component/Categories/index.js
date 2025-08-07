import { useState, useEffect } from "react";
import styles from "./Categories.module.scss";
import classNames from "classnames/bind";
import { categoryService } from "../../api/categoryService";
const cx = classNames.bind(styles);

function Category({ category }) {
  return (
    <div className={cx("category")}>
      <div className={cx("category-container")}>
        <img src={category.icon_url} />
        <span>{category.category_name.toUpperCase()}</span>
      </div>
    </div>
  );
}
function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const resCate = await categoryService.getAllCategories();
        if (resCate.status === 200) {
          const updateCates = resCate.data.data.filter(
            (cate) => !!cate.icon_url
          );
          setCategories(updateCates);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetch();
  }, []);

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <h1>Danh mục sản phẩm</h1>
        <div className={cx("categories")}>
          {categories.map((category, id) => {
            return <Category category={category} key={id} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default Categories;
