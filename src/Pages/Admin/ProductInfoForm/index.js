import { createContext, useEffect, useState } from "react";
import BrandSection from "../../../Component/BrandSection";
import CategorySection from "../../../Component/CategorySection";
import ProductSection from "../../../Component/ProductSection";
import styles from "./ProductInfoForm.module.scss";
import classNames from "classnames/bind";
import { brandService } from "../../../api/brandService";
import { useGetContext } from "../../../hooks/useGetContext";
import { categoryService } from "../../../api/categoryService";

const cx = classNames.bind(styles);

export const ProductInfoFormContext = createContext();

export const useProductInfoFormGetContext = () => {
  return useGetContext(ProductInfoFormContext);
};

function ProductInfoForm() {
  const [currentSection, setCurrentSection] = useState("product-current");
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await brandService.getAllBrands();

        if (response.data && response.data.data) {
          setBrands(response.data.data);
        }
      } catch (err) {
        console.error("Lỗi khi fetch brands:", err);
      }
    };

    const fetchCategory = async () => {
      try {
        const response = await categoryService.getAllCategories();

        if (response.data && response.data.data) {
          setCategories(response.data.data);
        }
      } catch (err) {
        console.error("Lỗi khi fetch categories:", err);
      }
    };

    fetchCategory();
    fetchBrands();
  }, []);

  const handleChangeSection = (sectionName) => {
    setCurrentSection(sectionName);
  };

  const contextValue = {
    brands,
    setBrands,
    categories,
    setCategories,
  };

  return (
    <ProductInfoFormContext.Provider value={contextValue}>
      <div className={cx("wrapper")}>
        <nav className={cx("navbar")}>
          <button onClick={() => handleChangeSection("product-current")}>
            Sản phẩm
          </button>
          <button onClick={() => handleChangeSection("brand-category-current")}>
            Hãng / Danh mục
          </button>
        </nav>
        <div className={cx("container", { [currentSection]: true })}>
          <div className={cx("product")}>
            <ProductSection />
          </div>

          <div className={cx("brand-category")}>
            <BrandSection />

            <CategorySection />
          </div>
        </div>
      </div>
    </ProductInfoFormContext.Provider>
  );
}

export default ProductInfoForm;
