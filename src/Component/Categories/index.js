import { useState, useEffect } from "react";
import styles from "./Categories.module.scss";
import classNames from "classnames/bind";
import { categoryService } from "../../api/categoryService";
import { Link } from "react-router-dom";
const cx = classNames.bind(styles);

function Category({ category }) {
  return (
    <Link
      className={cx("category")}
      to={`/product-list/${category.category_name.trim().replace(/ /g, "_")}/${
        category.category_id
      }?page=1`}
    >
      <div className={cx("category-container")}>
        <img src={category.icon_url} />
        <span>{category.category_name.toUpperCase()}</span>
      </div>
    </Link>
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
