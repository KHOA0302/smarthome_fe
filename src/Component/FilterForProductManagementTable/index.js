import { useEffect, useState } from "react";
import styles from "./FilterForProductManagementTable.module.scss";
import classNames from "classnames/bind";
import { brandService } from "../../api/brandService";
import { categoryService } from "../../api/categoryService";
import { BellIcon, ResetIcon } from "../../icons";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const cx = classNames.bind(styles);
function FilterForProductManagementTable({
  onChangeFilter,
  currentFilters,
  fetchProduct,
  promotionMode = false,
  editMode = false,
  predictMode = false,
  exportToExcel,
  handleAddPromotion = () => {},
  handleListPromotion = () => {},
  handleCheckVariants = () => {},
}) {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showFilterList, setShowFilterList] = useState("");

  const fetchBrandAndCategory = async () => {
    try {
      const resBrand = await brandService.getAllBrands();
      const resCategory = await categoryService.getAllCategories();
      setBrands(resBrand.data.data);
      setCategories(resCategory.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBrandAndCategory();
  }, []);

  const handleChangeBrand = (brand) => {
    onChangeFilter("brand", { id: brand.brand_id, name: brand.brand_name });
  };

  const handleChangeCategory = (category) => {
    onChangeFilter("category", {
      id: category.category_id,
      name: category.category_name,
    });
  };

  const handleChangeStatus = (status) => {
    onChangeFilter("status", status);
  };

  const brandList = (brand) => (
    <li
      key={brand.brand_id}
      onClick={() => handleChangeBrand(brand)}
      className={cx({ chosen: brand.brand_name === currentFilters.brand.name })}
    >
      {brand.brand_name}
    </li>
  );

  const categoryList = (category) => (
    <li
      key={category.category_id}
      onClick={() => handleChangeCategory(category)}
      className={cx({
        chosen: category.category_name === currentFilters.category.name,
      })}
    >
      {category.category_name}
    </li>
  );

  const handleReload = () => {
    fetchProduct();
    if (promotionMode) handleCheckVariants({ clear: true });
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <h4>Lọc sản:</h4>
        <div className={cx("filter-container")}>
          <div
            className={cx("filter-box")}
            onMouseEnter={() => setShowFilterList("brand")}
            onMouseLeave={() => setShowFilterList("")}
          >
            <span
              className={cx("filter-title", {
                show: showFilterList === "brand",
              })}
            >
              Hãng
            </span>
            <span className={cx("filter-chosen")}>
              {currentFilters.brand.name}
            </span>
            <ul
              className={cx("filter-list", {
                show: showFilterList === "brand",
              })}
            >
              {brands.map(brandList)}
            </ul>
          </div>
          <div
            className={cx("filter-box")}
            onMouseEnter={() => setShowFilterList("category")}
            onMouseLeave={() => setShowFilterList("")}
          >
            <span
              className={cx("filter-title", {
                show: showFilterList === "category",
              })}
            >
              Loại
            </span>
            <span className={cx("filter-chosen")}>
              {currentFilters.category.name}
            </span>
            <ul
              className={cx("filter-list", {
                show: showFilterList === "category",
              })}
            >
              {categories.map(categoryList)}
            </ul>
          </div>
          {promotionMode}
          {editMode ||
            (predictMode && (
              <div
                className={cx("filter-box")}
                onMouseEnter={() => setShowFilterList("status")}
                onMouseLeave={() => setShowFilterList("")}
              >
                <span
                  className={cx("filter-title", {
                    show: showFilterList === "status",
                  })}
                >
                  Trạng thái
                </span>
                <span className={cx("filter-chosen")}>
                  {currentFilters.status.name}
                </span>
                <ul
                  className={cx("filter-list", {
                    show: showFilterList === "status",
                  })}
                  style={{ width: "fit-content" }}
                >
                  <li
                    onClick={() => handleChangeStatus({ id: 0, name: "hide" })}
                    className={cx({
                      chosen: "hide" === currentFilters.status.name,
                    })}
                  >
                    ẩn
                  </li>
                  <li
                    onClick={() =>
                      handleChangeStatus({ id: 1, name: "reveal" })
                    }
                    className={cx({
                      chosen: "reveal" === currentFilters.status.name,
                    })}
                  >
                    hiện
                  </li>
                </ul>
              </div>
            ))}
        </div>
      </div>
      <div className={cx("utility")}>
        <Tippy content="Tải lại danh sách">
          <div className={cx("reset-list")}>
            <button onClick={handleReload}>
              <ResetIcon />
            </button>
          </div>
        </Tippy>
        <Tippy content="Thông báo sản phẩm hết hàng">
          <div className={cx("notification")}>
            <button>
              <BellIcon />
            </button>
          </div>
        </Tippy>

        {promotionMode && (
          <>
            <div className={cx("add-promotion")}>
              <button onClick={handleAddPromotion}>ADD PROMOTION</button>
            </div>
            <div className={cx("list-promotion")}>
              <button onClick={handleListPromotion}>SHOW PROMOTION</button>
            </div>
          </>
        )}

        {predictMode && (
          <>
            <div className={cx("export-excel")}>
              <button onClick={exportToExcel}>XUẤT EXCEL</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default FilterForProductManagementTable;
