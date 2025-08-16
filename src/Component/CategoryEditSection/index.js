import { useEffect, useRef, useState } from "react";
import styles from "./CategoryEditSection.module.scss";
import classNames from "classnames/bind";
import { categoryService } from "../../api/categoryService";
import errImg from "../../images/no_img.png";
import { TrashIcon } from "../../icons";
import toast, { Toaster } from "react-hot-toast";
import {
  deleteImageFromFirebase,
  uploadImageToFirebase,
} from "../../utils/firebaseUpload";
const cx = classNames.bind(styles);

function searchCategoriesFunction(categoriesData, searchTerm) {
  const lowerCaseSearchTerm = searchTerm.toLowerCase();

  return Object.values(categoriesData).filter((category) => {
    return (
      category.category_name &&
      category.category_name.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });
}
function CategoryEditSection() {
  const iconRef = useRef(null);
  const bannerRef = useRef(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchCategories, setSearchCategories] = useState([]);
  const [categorySelected, setCategorySelected] = useState({
    category_id: "",
    banner: "",
    category_name: "",
    icon_url: "",
    slogan: "",
    isRemove: false,
  });

  const fetch = async () => {
    try {
      const res = await categoryService.getAllCategories();
      setCategories(res.data.data);
      setSearchCategories(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleSearchCategories = (e) => {
    const newSearchCategories = searchCategoriesFunction(
      categories,
      e.target.value
    );
    setSearchCategories(newSearchCategories);
  };

  const handleSetCategorySelected = (category) => {
    setCategorySelected({ ...category, isRemove: false });
    setShowSearchResult(!showSearchResult);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const tempImageUrl = URL.createObjectURL(file);
    let newCategorySelected;
    switch (e.target.name) {
      case "iconTempImg":
        newCategorySelected = {
          ...categorySelected,
          icon_url: tempImageUrl,
          iconFile: file,
        };
        break;
      case "bannerTempImg":
        newCategorySelected = {
          ...categorySelected,
          banner: tempImageUrl,
          bannerFile: file,
        };
        break;
      default:
        break;
    }

    setCategorySelected(newCategorySelected);
  };

  console.log(categorySelected);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!categorySelected.category_id) {
      toast.error("Vui lòng chọn một danh mục để chỉnh sửa.");
      return;
    }
    const originalCategory = categories.find(
      (cat) => cat.category_id === categorySelected.category_id
    );

    const updateCategoryPromise = new Promise(async (resolve, reject) => {
      let finalCategoryData = { ...categorySelected };
      const oldIconUrl = originalCategory.icon_url;
      const oldBannerUrl = originalCategory.banner_url;

      try {
        if (finalCategoryData.isRemove) {
          delete finalCategoryData.iconFile;
          delete finalCategoryData.bannerFile;
          delete finalCategoryData.icon_url;
          delete finalCategoryData.banner_url;

          const res = await categoryService.editCategory(finalCategoryData);

          resolve(res);
          return;
        }

        if (finalCategoryData.iconFile) {
          finalCategoryData.icon_url = await uploadImageToFirebase(
            finalCategoryData.iconFile,
            "category"
          );

          delete finalCategoryData.iconFile;
        }

        if (finalCategoryData.bannerFile) {
          finalCategoryData.banner = await uploadImageToFirebase(
            finalCategoryData.bannerFile,
            "category"
          );

          delete finalCategoryData.bannerFile;
        }

        const res = await categoryService.editCategory(finalCategoryData);

        if (finalCategoryData.iconFile && oldIconUrl) {
          await deleteImageFromFirebase(oldIconUrl);
        }

        if (finalCategoryData.bannerFile && oldBannerUrl) {
          await deleteImageFromFirebase(oldBannerUrl);
        }

        setCategorySelected({
          category_id: "",
          banner: "",
          category_name: "",
          icon_url: "",
          slogan: "",
          isRemove: false,
        });

        fetch();
        resolve(res);
      } catch (error) {
        if (finalCategoryData.icon_url && finalCategoryData.iconFile) {
          await deleteImageFromFirebase(finalCategoryData.icon_url);
        }
        if (finalCategoryData.banner && finalCategoryData.bannerFile) {
          await deleteImageFromFirebase(finalCategoryData.banner);
        }

        reject(error);
      }
    });

    toast.promise(updateCategoryPromise, {
      loading: "Đang xử lý cập nhật danh mục...",
      success: (res) => {
        return res.data.message;
      },
      error: (err) => {
        return `Cập nhật danh mục thất bại: ${
          err.response?.data?.message || "Lỗi không xác định"
        }`;
      },
    });
  };

  return (
    <div className={cx("wrapper")}>
      <h1>Danh mục</h1>
      <div className={cx("container")}>
        <div className={cx("categories-search")}>
          <div className={cx("search-wrapper")}>
            <input
              onChange={handleSearchCategories}
              autoComplete="off"
              id="banner-exist"
              type="text"
              onFocus={() => setShowSearchResult(true)}
              onBlur={() => setShowSearchResult(false)}
              onClick={() => setShowSearchResult(true)}
              placeholder="Nhập tên danh mục..."
            />
            <ul className={cx({ show: showSearchResult })}>
              {searchCategories.map((category, id) => {
                return (
                  <li
                    onClick={() => handleSetCategorySelected(category)}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {category.category_name}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className={cx("category-form", { remove: categorySelected.isRemove })}
        >
          <div className={cx("category-selected")}>
            <div className={cx("category-icon")}>
              <div className={cx("icon-wrapper")}>
                <div className={cx("icon-input")}>
                  <input
                    name="brand-name"
                    value={categorySelected.category_name}
                    onChange={(e) =>
                      setCategorySelected((prev) => ({
                        ...prev,
                        category_name: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className={cx("icon-img")}>
                  <div className={cx("icon-img-blank")}>
                    <img
                      key={categorySelected.icon_url}
                      src={
                        !!categorySelected.icon_url
                          ? categorySelected.icon_url
                          : errImg
                      }
                    />
                    <div className={cx("icon-cover")}>
                      <button
                        type="button"
                        onClick={() => iconRef.current.click()}
                      >
                        ĐỔI
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  className={cx("delete-category")}
                  onClick={() =>
                    setCategorySelected((prev) => ({
                      ...prev,
                      isRemove: !categorySelected.isRemove,
                    }))
                  }
                  type="button"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
            <div className={cx("category-banner")}>
              <div className={cx("banner-wrapper")}>
                <input
                  key={categorySelected.banner}
                  value={categorySelected.slogan}
                  name="slogan"
                  onChange={(e) =>
                    setCategorySelected((prev) => ({
                      ...prev,
                      slogan: e.target.value,
                    }))
                  }
                />
                <div className={cx("banner-img")}>
                  <div className={cx("banner-img-blank")}>
                    <img
                      key={categorySelected.banner}
                      src={
                        !!categorySelected.banner
                          ? categorySelected.banner
                          : errImg
                      }
                    />
                    <div className={cx("banner-cover")}>
                      <button
                        type="button"
                        onClick={() => bannerRef.current.click()}
                      >
                        ĐỔI
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button type="submit" className={cx("submit-btn")}>
            SUBMIT
          </button>
        </form>
      </div>
      <input
        type="file"
        hidden
        ref={iconRef}
        name="iconTempImg"
        onChange={handleFileChange}
        accept="image/*"
      />
      <input
        type="file"
        hidden
        ref={bannerRef}
        name="bannerTempImg"
        onChange={handleFileChange}
        accept="image/*"
      />
      <Toaster position="top-right" reverseOrder={true} />
    </div>
  );
}

export default CategoryEditSection;
