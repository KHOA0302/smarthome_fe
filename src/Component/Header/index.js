import styles from "./Header.module.scss";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import { CartIcon, SearchIcon } from "../../icons";
import authService from "../../api/authService";
import { useEffect, useState } from "react";
import zaku from "../../images/zaku.png";
import logo from "../../images/logo.png";
import cartService from "../../api/cartService";
import { useCartItemQuantContext } from "../../layout/CommonLayout";

const cx = classNames.bind(styles);

function Header() {
  const [user, setUser] = useState({});
  const { cartItemQuant, setCartItemQuant } = useCartItemQuantContext();
  useEffect(() => {
    const fetch = async () => {
      try {
        const resUser = await authService.getUserInfo();
        if (resUser.status === 200) {
          setUser({
            ...resUser.data,
            ...authService.getCurrentUser(),
          });
        }
        const resCar = await cartService.getCartItem();
        if (resCar.status === 200) {
          setCartItemQuant(
            resCar.data.cartItems.reduce(
              (number, item) => item.quantity + number,
              0
            )
          );
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetch();
  }, []);

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <Link className={cx("logo")} to="/home">
          <img src={logo} />
        </Link>
        <nav className={cx("nav")}>
          <ul>
            <li>
              <Link>Danh mục</Link>
            </li>
            <li>
              <Link>Hãng</Link>
            </li>
            <li>
              <Link>Sản phẩm nổi bật</Link>
            </li>
          </ul>
        </nav>
        <div className={cx("user")}>
          <div className={cx("user-wrapper")}>
            <div className={cx("search")}>
              <div className={cx("search-wrapper")}>
                <input type="text" placeholder="Tìm kiếm..." name="search" />
                <SearchIcon />
              </div>
            </div>
            <Link to="/cart">
              <CartIcon />
              <div>
                <span>{cartItemQuant}</span>
              </div>
            </Link>
            <Link className={cx("avatar")} to="/customer">
              <img src={user.avatar || zaku} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
