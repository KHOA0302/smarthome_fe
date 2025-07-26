import { useEffect, useState } from "react";
import cartService from "../../api/cartService";
import CartItem from "../../Component/CartItem";
import styles from "./cart.module.scss";
import classNames from "classnames/bind";
import { formatNumber } from "../../utils/formatNumber";
import { ExistIcon, MoneyIcon, TruckIcon } from "../../icons";
import authService from "../../api/authService";

const cx = classNames.bind(styles);
function Cart() {
  const [showCover, setShowCover] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const fetchCartItem = async () => {
      try {
        const res = await cartService.getCartItem();
        if (res.status === 200) {
          setCartItems(res.data.cartItems);
        }
      } catch (error) {
        console.error("there no cart");
      }
    };
    fetchCartItem();
  }, []);

  const totalPrice = cartItems.reduce(
    (accumulator, currentValue) =>
      accumulator +
      parseInt(currentValue.price) * parseInt(currentValue.quantity),
    0
  );

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await authService.getUserInfo();
        if (res.status === 200) {
          setUserInfo(res.data);
        }
      } catch (error) {}
    };

    if (!!authService.getCurrentUser()) {
      fetchUserInfo();
    }
  }, [showCover]);

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("cart-items")}>
          {cartItems.map((cartItem, id) => (
            <CartItem cartItem={cartItem} key={id} />
          ))}
        </div>
        <div className={cx("cart-price")}>
          <span>Tổng tiền</span>
          <span>{formatNumber(totalPrice)}đ</span>
        </div>
      </div>
      <button className={cx("cart-pay-btn")} onClick={() => setShowCover(true)}>
        Thanh toán
      </button>
      <div className={cx("cart-cover", { show: showCover })}>
        <div className={cx("cart-cover-wrapper")}>
          <div className={cx("cart-cover-top")}>
            <span>Thông tin đơn hàng</span>
            <button onClick={() => setShowCover(false)}>
              <ExistIcon />
            </button>
          </div>
          {!userInfo.is_profile_complete && (
            <div className={cx("cart-cover-warning")}>
              <span>Vui lòng nhập/kiểm tra thông tin đặt hàng</span>
            </div>
          )}
          <div className={cx("cart-cover-contact")}>
            <div className={cx("cart-cover-contact-title")}>
              <span>Thông tin người đặt</span>
              <button>Chỉnh sửa</button>
            </div>
            <div className={cx("cart-cover-contact-main")}>
              <div className={cx("cart-cover-info-form")}>
                <span>Tên:</span>
                <span>{userInfo.full_name}</span>
              </div>
              <div className={cx("cart-cover-info-form")}>
                <span>Số điện thoại:</span>
                <span>{userInfo.phone_number}</span>
              </div>
            </div>
          </div>
          <div className={cx("cart-cover-delivery")}>
            <span>Hình thức giao hàng</span>
            <button>
              <span>Giao tận nơi</span>
              <TruckIcon />
            </button>
          </div>
          <div className={cx("cart-cover-payment")}>
            <span>Hình thức thanh toán </span>
            <div className={cx("cart-cover-payment-method")}>
              <input type="radio" name="payment" checked />
              <div>
                <MoneyIcon />
                <span>Thanh toán khi nhận hàng</span>
              </div>
            </div>
          </div>
          <div className={cx("cart-cover-address")}>
            <div className={cx("cart-cover-address-title")}>
              <span>Địa chỉ giao hàng</span>
              <button>Chỉnh sửa</button>
            </div>
            <div className={cx("cart-cover-address-main")}>
              <div className={cx("cart-cover-info-form")}>
                <span>Tỉnh:</span>
                <span>{userInfo.province}</span>
              </div>
              <div className={cx("cart-cover-info-form")}>
                <span>Quận:</span>
                <span>{userInfo.district}</span>
              </div>
              <div className={cx("cart-cover-info-form")}>
                <span>Số nhà:</span>
                <span>{userInfo.house_number}</span>
              </div>
            </div>
          </div>
          <button className={cx("cart-cover-approve")}>Xác nhận</button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
