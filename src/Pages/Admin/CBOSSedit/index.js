import { useState } from "react";
import styles from "./CBOSSedit.module.scss";
import classNames from "classnames/bind";
import BrandEditSection from "../../../Component/BrandEditSection";
import CategoryEditSection from "../../../Component/CategoryEditSection";
const cx = classNames.bind(styles);
function CBOSSedit() {
  const [currentSection, setCurrentSection] = useState(
    "brand-category-current"
  );

  const handleChangeSection = (sectionName) => {
    setCurrentSection(sectionName);
  };

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
          <section className={cx("edit-option-service")}></section>
          <section className={cx("edit-specification")}></section>
        </div>
      </div>
    </div>
  );
}

export default CBOSSedit;
