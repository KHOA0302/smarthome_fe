import styles from "./Navbar.module.scss";
import classNames from "classnames/bind";

import zaku from "../../images/zaku.png";
import { NavLink, replace, useNavigate } from "react-router-dom";
import authService from "../../api/authService";

const cx = classNames.bind(styles);

function Navbar({ navItems }) {
  const navigate = useNavigate();
  return (
    <nav className={cx("wrapper")}>
      <h1>SmartHome</h1>
      <div className={cx("user")}>
        <div className={cx("user-wrapper")}>
          <img src={zaku} alt="avatar" />
          <span>Zaku</span>
        </div>
      </div>
      <div className={cx("navbar-option")}>
        {navItems.map((item, id) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={id}
              to={item.route}
              className={({ isActive }) =>
                cx("navbar-item", { active: isActive })
              }
            >
              <div className={cx("item-container")}>
                <Icon />
                <span>{item.name}</span>
              </div>
            </NavLink>
          );
        })}
      </div>
      <button
        className={cx("log-out-btn")}
        onClick={() => {
          authService.logout();
          navigate("/", { replace: true });
        }}
        type="button"
      >
        Đăng xuất
      </button>
    </nav>
  );
}

export default Navbar;
