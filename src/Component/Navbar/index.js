import styles from "./Navbar.module.scss";
import classNames from "classnames/bind";
import logo from "../../images/logo.png";
import zaku from "../../images/zaku.png";
import { NavLink, replace, useNavigate } from "react-router-dom";
import authService from "../../api/authService";
import { memo } from "react";

const cx = classNames.bind(styles);

function Navbar({ navItems }) {
  const navigate = useNavigate();
  return (
    <nav className={cx("wrapper")}>
      <div className={cx("logo")} onClick={() => navigate("/")}>
        <img src={logo} />
      </div>
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

export default memo(Navbar);
