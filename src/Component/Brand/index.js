import styles from "./Brand.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);
function Brand({ brand, ref, isActive }) {
  return (
    <div className={cx("wrapper")} ref={ref}>
      <div className={cx("container", { active: isActive })}>
        <div className={cx("brand")}>
          <img src={brand.logo_url} />
        </div>
      </div>
    </div>
  );
}

export default Brand;
