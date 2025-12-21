import styles from "./Header.module.scss";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import { CartIcon, LoadingIcon, SearchIcon } from "../../icons";
import authService from "../../api/authService";
import { useEffect, useState } from "react";
import zaku from "../../images/zaku.png";
import logo from "../../images/logo.png";
import cartService from "../../api/cartService";
import { useCartItemQuantContext } from "../../layout/CommonLayout";
import productService from "../../api/productService";
import useDebounce from "../../hooks/useDebounce";
import { formatNumber } from "../../utils/formatNumber";

const cx = classNames.bind(styles);

function Header() {
  const [user, setUser] = useState({});
  const { cartItemQuant, setCartItemQuant } = useCartItemQuantContext();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [productSearchResult, setProductSearchResult] = useState([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

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
      } catch (error) {
        console.error(error);
      }
      try {
        const resCart = await cartService.getCartItem();
        if (resCart.status === 200) {
          setCartItemQuant(
            resCart.data.cartItems.reduce(
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

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);

      try {
        const res = await productService.searchTopProduct(searchKeyword);
        setProductSearchResult(res.data.products);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    if (!!searchKeyword) {
      fetch();
    } else {
      setProductSearchResult([]);
    }
  }, [searchKeyword]);

  const handleSearch = (e) => {
    setSearchKeyword(e.target.value);
  };
  const toOrder = !!Object.keys(user).length ? "/customer/order" : "/order";

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
              <Link to={toOrder}>Đơn hàng</Link>
            </li>
          </ul>
        </nav>
        <div className={cx("user")}>
          <div className={cx("user-wrapper")}>
            <div className={cx("search")}>
              <div className={cx("search-wrapper")}>
                <input
                  value={searchKeyword}
                  onChange={handleSearch}
                  type="text"
                  placeholder="Tìm kiếm..."
                  name="search"
                  onFocus={() => setShow(true)}
                  onBlur={() => setShow(false)}
                />
                <div className={cx("search-products", { show: show })}>
                  <div className={cx("search-products-container")}>
                    {productSearchResult.map((product) => {
                      return product.variants.map((variant, id) => {
                        return (
                          <Link
                            to={`/product/${product.product_id}/variant/${variant.variant_id}`}
                            className={cx("product-link")}
                            onMouseDown={(e) => {
                              e.preventDefault();
                            }}
                            onClick={() => setShow(false)}
                            key={id}
                          >
                            <div className={cx("product")}>
                              <div className={cx("product-img")}>
                                <img src={variant.image_url} />
                              </div>
                              <div className={cx("product-main")}>
                                <span>{variant.variant_name}</span>
                                <span>
                                  {formatNumber(parseInt(variant.price))}đ
                                </span>
                              </div>
                            </div>
                          </Link>
                        );
                      });
                    })}
                  </div>
                </div>
                {loading ? <LoadingIcon /> : <SearchIcon />}
              </div>
            </div>
            <Link to="/cart" className={cx("navbar")}>
              <CartIcon />
              <div>
                <span>{cartItemQuant}</span>
              </div>
            </Link>
            {user?.role?.role_name === "admin" && (
              <Link className={cx("avatar", "navbar")} to="/admin">
                <img src={user.avatar || zaku} />
              </Link>
            )}
            {user?.role?.role_name === "customer" && (
              <Link className={cx("avatar", "navbar")} to="/customer">
                <img src={user.avatar || zaku} />
              </Link>
            )}
            {!user?.role?.role_name && (
              <Link className={cx("avatar", "navbar")} to="/login">
                <img src={user.avatar || zaku} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
