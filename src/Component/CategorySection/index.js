import { memo, useEffect, useState } from "react";
import styles from "./CategorySection.module.scss";
import classNames from "classnames/bind";
import { uploadImageToFirebase } from "../../utils/firebaseUpload";
import { useProductInfoFormGetContext } from "../../Pages/Admin/ProductInfoForm";
import { categoryService } from "../../api/categoryService";
const cx = classNames.bind(styles);

function CategorySection() {
  const { categories, setCategories } = useProductInfoFormGetContext();
  const [category, setCategory] = useState({
    name: "",
    slogan: "",
    icon: "",
    banner: "",
  });

  const [categoriesModified, setCategoriesModified] = useState([]);

  useEffect(() => {
    const newCategories = categories.map((c) => {
      return {
        ...c,
        isExist: false,
      };
    });
    setCategoriesModified(newCategories);
  }, [categories]);

  const handleChangCategory = (e) => {
    let newCategory;
    switch (e.target.name) {
      case "name":
        if (
          categories.some(
            (c) =>
              c.category_name.toLowerCase().trim() ===
              e.target.value.toLowerCase().trim()
          )
        ) {
          newCategory = {
            ...category,
            name: "",
          };
          const newCategoriesModified = categoriesModified.map((c) => {
            if (
              c.category_name.toLowerCase().trim() ===
              e.target.value.toLowerCase().trim()
            ) {
              c.isExist = true;
            } else {
              c.isExist = false;
            }

            return c;
          });

          setCategoriesModified(newCategoriesModified);
          setCategory(newCategory);
        } else {
          newCategory = {
            ...category,
            name: e.target.value,
          };
          setCategory(newCategory);
        }
        break;
      case "icon":
        newCategory = {
          ...category,
          icon: e.target.files[0],
        };
        setCategory(newCategory);
        break;
      case "slogan":
        newCategory = {
          ...category,
          slogan: e.target.value,
        };
        setCategory(newCategory);
        break;
      case "banner":
        newCategory = {
          ...category,
          banner: e.target.files[0],
        };
        setCategory(newCategory);
        break;
      default:
        break;
    }
  };

  const categoryHtml = categoriesModified.map((b, id) => {
    return (
      <div key={id} className={cx({ ["category-exist"]: b.isExist })}>
        <img src={b.icon_url} />
        <span>{b.category_name}</span>
      </div>
    );
  });

  const fetchCreateCategory = async (e) => {
    e.preventDefault();
    try {
      const updateCategory = {
        ...category,
        icon: await uploadImageToFirebase(category.icon, "category"),
        banner: await uploadImageToFirebase(category.banner, "category"),
        displayOrder: categories[categories.length - 1].display_order + 100000,
      };

      const res = await categoryService.createCategory(updateCategory);

      if (res.status === 201) {
        const allCategories = res.data.data.allCategories;
        setCategories(allCategories);
        setCategory({
          name: "",
          slogan: "",
          icon: "",
          banner: "",
        });
      }
    } catch (err) {
      console.error("Lỗi khi tạo category:", err);
    }
  };

  return (
    <form onSubmit={fetchCreateCategory}>
      <div className={cx("category-form")}>
        <div className={cx("category-wrapper")}>
          <div>
            <h1>Danh mục</h1>
            <div className={cx("category-container")}>
              <div className={cx("category-inputs")}>
                <div className={cx("category-input")}>
                  <span>Tên / Icon</span>
                  <div>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Nhập tên danh mục..."
                      value={category.name}
                      onChange={handleChangCategory}
                      required
                    />
                    <input
                      type="file"
                      name="icon"
                      onChange={handleChangCategory}
                      required
                    />
                  </div>
                </div>
                <div className={cx("category-input")}>
                  <span>Banner / Slogan</span>
                  <div>
                    <input
                      type="text"
                      name="slogan"
                      id="slogan"
                      placeholder="Nhập slogan cho danh hiệu..."
                      onChange={handleChangCategory}
                      value={category.slogan}
                    />
                    <input
                      type="file"
                      name="banner"
                      onChange={handleChangCategory}
                    />
                  </div>
                </div>
              </div>
              <div className={cx("categories-exist")}>{categoryHtml}</div>
            </div>
          </div>
          <button type="submit">Gửi</button>
        </div>
      </div>
    </form>
  );
}

export default memo(CategorySection);
