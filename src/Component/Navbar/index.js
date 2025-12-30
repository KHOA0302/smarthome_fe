import styles from "./Navbar.module.scss";
import classNames from "classnames/bind";
import logo from "../../images/logo.png";
import zaku from "../../images/zaku.png";
import { NavLink, useNavigate } from "react-router-dom";
import { memo } from "react";
import { useWebSocket } from "../../hooks/useWebSocket";
import { useAuth } from "../../context/AuthContext";

const cx = classNames.bind(styles);

const emptyCallback = () => {};

function Navbar({ navItems }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const { closeSocket } = useWebSocket(emptyCallback);

  const handleLogout = async () => {
    closeSocket();
    logout();
    navigate("/", { replace: true });
  };
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
        onClick={handleLogout}
        type="button"
      >
        Đăng xuất
      </button>
    </nav>
  );
}

export default memo(Navbar);
