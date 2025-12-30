import { useEffect, useState } from "react";
import styles from "./CBOSSedit.module.scss";
import classNames from "classnames/bind";
import BrandEditSection from "../../../Component/BrandEditSection";
import CategoryEditSection from "../../../Component/CategoryEditSection";
import OptionEditSection from "../../../Component/OptionEditSection";
import { categoryService } from "../../../api/categoryService";
import ServiceEditSection from "../../../Component/ServiceEditSection";
const cx = classNames.bind(styles);
function CBOSSedit() {
  const [categories, setCategories] = useState([]);
  const [currentSection, setCurrentSection] = useState(
    "option-service-current"
  );
  const [chosenCate, setChosenCate] = useState(null);
  const [showCateSelector, setShowCateSelector] = useState(null);

  const handleChangeSection = (sectionName) => {
    setCurrentSection(sectionName);
  };

  const fetchCate = async () => {
    try {
      const res = await categoryService.getAllCategories();
      setCategories(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCate();
  }, []);

  const [chosenCateOject] = categories.filter(
    (cate) => cate.category_id === chosenCate
  );
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <nav className={cx("navbar")}>
          <button
            className={cx({
              active: currentSection === "brand-category-current",
            })}
            onClick={() => handleChangeSection("brand-category-current")}
          >
            Hãng / Danh mục
          </button>
          <button
            className={cx({
              active: currentSection === "option-service-current",
            })}
            onClick={() => handleChangeSection("option-service-current")}
          >
            Option / Dịch vụ
          </button>
          <button
            className={cx({
              active: currentSection === "specification-current",
            })}
            onClick={() => handleChangeSection("specification-current")}
          >
            Thông số kĩ thuật
          </button>
        </nav>
        <div className={cx("edit-section", { [currentSection]: true })}>
          <section className={cx("edit-brand-category")}>
            <BrandEditSection />
            <CategoryEditSection />
          </section>
          <section className={cx("edit-option-service")}>
            <div
              className={cx("categories-selector")}
              onMouseEnter={() => setShowCateSelector(!showCateSelector)}
              onMouseLeave={() => setShowCateSelector(!showCateSelector)}
            >
              <div className={cx("chosen-category")}>
                <h4>Chọn hãng</h4>
                <span>{chosenCateOject?.category_name.toUpperCase()}</span>
              </div>
              <ul
                className={cx("list-category", {
                  show: showCateSelector === true,
                  hide: showCateSelector === false,
                })}
              >
                {categories.map((cate, id) => {
                  return (
                    <li
                      key={id}
                      className={cx({
                        active: chosenCate === cate.category_id,
                      })}
                      onClick={() => {
                        if (chosenCate === cate.category_id) {
                          setChosenCate(null);
                          return;
                        }
                        setChosenCate(cate.category_id);
                      }}
                    >
                      {cate.category_name.toUpperCase()}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className={cx("edit-option")}>
              <OptionEditSection chosenCate={chosenCate} />
            </div>
            <div className={cx("edit-service")}>
              <ServiceEditSection chosenCate={chosenCate} />
            </div>
          </section>
          <section className={cx("edit-specification")}></section>
        </div>
      </div>
    </div>
  );
}

export default CBOSSedit;
