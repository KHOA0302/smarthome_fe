import { memo, useEffect, useReducer, useRef, useState } from "react";
import cartService from "../../api/cartService";
import CartItem from "../../Component/CartItem";
import styles from "./cart.module.scss";
import classNames from "classnames/bind";
import { formatNumber } from "../../utils/formatNumber";
import { ExistIcon, MoneyIcon, TruckIcon } from "../../icons";
import authService from "../../api/authService";
import orderService from "../../api/orderService";
import {
  decreaseItemThunk,
  deleteItemThunk,
  increaseItemThunk,
} from "./actionsThunk";
import { initState, reducer } from "./reducer";
import { ToastContainer, toast } from "react-toastify";
import { useCartItemQuantContext } from "../../layout/CommonLayout";
import { useLocation, useNavigate } from "react-router";
import vnpay from "../../images/vnpay.webp";
const cx = classNames.bind(styles);

const createMiddleware = (originalDispatch, state) => (action) => {
  if (typeof action === "function") {
    return action(originalDispatch, () => state);
  }
  return originalDispatch(action);
};

function Cart() {
  const { setCartItemQuant } = useCartItemQuantContext();
  const [state, originalDispatch] = useReducer(reducer, initState);
  const { cartItems, orderInfo, loading, error, success } = state;
  const [showCover, setShowCover] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [guestInfo, setGuestInfo] = useState({
    guest_name: "",
    guest_phone: "",
    guest_province: "",
    guest_district: "",
    guest_house_number: "",
  });
  const middlewareRef = useRef();
  const navigate = useNavigate();

  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      toast.success(success);
    }
  }, [success]);

  useEffect(() => {
    middlewareRef.current = createMiddleware(originalDispatch, state);
    setCartItemQuant(
      cartItems.reduce((number, item) => item.quantity + number, 0)
    );
  }, [state, originalDispatch]);

  const dispatch = middlewareRef.current;

  const handleDecreaseItem = (itemId) => {
    if (dispatch) {
      dispatch(decreaseItemThunk(itemId));
    }
  };

  const handleIncreaseItem = (itemId) => {
    if (dispatch) {
      dispatch(increaseItemThunk(itemId));
    }
  };

  const handleDeleteItem = (itemId) => {
    if (dispatch) {
      dispatch(deleteItemThunk(itemId));
    }
  };

  useEffect(() => {
    const fetchCartItem = async () => {
      originalDispatch({ type: "FETCH_START" });
      try {
        const res = await cartService.getCartItem();

        if (res.status === 200) {
          originalDispatch({
            type: "FETCH_SUCCESS",
            payload: { cartItems: res.data.cartItems, cartId: res.data.cartId },
          });
        }
      } catch (error) {
        originalDispatch({ type: "FETCH_ERROR", payload: error });
        console.error("there no cart");
      }
    };
    fetchCartItem();
  }, []);

  console.log(cartItems);

  const totalPrice = state.cartItems.reduce((accumulator, cartItem) => {
    const servicesPrice = cartItem.services.reduce((ac, service) => {
      return ac + parseFloat(service.price || 0);
    }, 0);

    const price = parseFloat(cartItem.variant.price);

    const discountPrice =
      (parseInt(cartItem.variant.price) *
        (100 -
          parseInt(
            cartItem.variant?.promotionVariant?.promotion?.discount_value
          ))) /
        100 || null;

    const fullPrice = discountPrice
      ? parseFloat(discountPrice) + parseFloat(servicesPrice)
      : price + parseFloat(servicesPrice);

    console.log(fullPrice);
    return accumulator + parseInt(fullPrice) * parseInt(cartItem.quantity);
  }, 0);

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

  const handleCreateOrder = (e) => {
    e.preventDefault();
    if (loading) return;
    if (Object.keys(userInfo).length > 0 && !userInfo.is_profile_complete) {
      toast.error("Vui lòng điền địa chỉ tạo trang cusmtomer");
      return;
    }
    const createOrderPromise = new Promise(async (resolve, reject) => {
      originalDispatch({ type: "FETCH_START" });
      try {
        const res = await orderService.createOrder(state.orderInfo, guestInfo);
        if (res.status === 201) {
          const redirectToVnPay = res.data?.redirect;

          if (res.data?.redirect) {
            window.open(redirectToVnPay, "_blank");
          }
          setCartItemQuant(0);
          setShowCover(false);
          originalDispatch({ type: "CLEAR_CART" });
          resolve("Đơn hàng đã được tạo thành công!");
        } else {
          reject(new Error(res.data.message));
          originalDispatch({ type: "FETCH_ERROR", payload: res.data.message });
        }
      } catch (error) {
        reject(error);
        originalDispatch({
          type: "FETCH_ERROR",
          payload: "",
        });
      }
    });

    toast
      .promise(
        createOrderPromise,
        {
          pending: "Đang tạo đơn hàng...",
          success: "Đơn hàng đã được tạo thành công! 🎉",
          error: "Tạo đơn hàng thất bại",
        },
        {
          toastClassName: "custom-toast-position",
        }
      )

      .catch((error) => {
        const errorMess = error?.response.data.message;
        toast.error(errorMess);
      });
  };

  const isAuth = authService.isAuthenticated();
  const hasEmptyField = Object.values(guestInfo).some((value) => value === "");

  const handleEditGuestInfo = (e) => {
    switch (e.target.name) {
      case "username":
        setGuestInfo((prev) => ({
          ...prev,
          guest_name: e.target.value,
        }));
        break;
      case "phone_number":
        setGuestInfo((prev) => ({
          ...prev,
          guest_phone: e.target.value,
        }));
        break;
      case "province":
        setGuestInfo((prev) => ({
          ...prev,
          guest_province: e.target.value,
        }));
        break;
      case "district":
        setGuestInfo((prev) => ({
          ...prev,
          guest_district: e.target.value,
        }));
        break;
      case "house_number":
        setGuestInfo((prev) => ({
          ...prev,
          guest_house_number: e.target.value,
        }));
        break;
      default:
        break;
    }
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("cart-items")}>
          {cartItems.map((cartItem, id) => (
            <CartItem
              cartItem={cartItem}
              key={id}
              handleDecreaseItem={!loading ? handleDecreaseItem : () => {}}
              handleIncreaseItem={!loading ? handleIncreaseItem : () => {}}
              handleDeleteItem={!loading ? handleDeleteItem : () => {}}
            />
          ))}
        </div>
        {!!!cartItems.length && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <span style={{ fontSize: " 2rem", fontWeight: "900" }}>
              Giỏ hàng rổng
            </span>
          </div>
        )}
        {!!cartItems.length && (
          <div className={cx("cart-price")}>
            <span>Tổng tiền</span>
            <span>{formatNumber(totalPrice)}đ</span>
          </div>
        )}
      </div>
      {!!cartItems.length && (
        <button
          className={cx("cart-pay-btn")}
          onClick={() => setShowCover(true)}
          type="button"
        >
          Thanh toán
        </button>
      )}

      <form
        className={cx("cart-cover", { show: showCover })}
        onSubmit={handleCreateOrder}
      >
        <div className={cx("cart-cover-wrapper")}>
          <div className={cx("cart-cover-top")}>
            <span>Thông tin đơn hàng</span>
            <button onClick={() => setShowCover(false)} type="button">
              <ExistIcon />
            </button>
          </div>
          {!isAuth && hasEmptyField && (
            <div className={cx("cart-cover-warning")}>
              <span style={{ color: "red" }}>
                Vui lòng nhập/kiểm tra thông tin đặt hàng
              </span>
              <button onClick={() => navigate("/login")} type="button">
                <span>
                  Hoặc <p>đăng nhập</p> để mua hàng thuận tiện hơn
                </span>
              </button>
            </div>
          )}
          {isAuth && !userInfo.is_profile_complete && (
            <span style={{ color: "red" }}>
              Vui lòng nhập/kiểm tra thông tin đặt hàng
            </span>
          )}
          <div className={cx("cart-cover-contact")}>
            <div className={cx("cart-cover-contact-title")}>
              <span>Thông tin người đặt</span>
              {isAuth && (
                <button
                  onClick={() => navigate("/customer/dashboard")}
                  type="button"
                >
                  Chỉnh sửa
                </button>
              )}
            </div>
            <div className={cx("cart-cover-contact-main")}>
              <div className={cx("cart-cover-info-form")}>
                <span>Tên:</span>
                {isAuth ? (
                  <span>{userInfo.full_name}</span>
                ) : (
                  <input
                    value={guestInfo.guest_name}
                    onChange={handleEditGuestInfo}
                    name="username"
                    type="text"
                    required
                  />
                )}
              </div>
              <div className={cx("cart-cover-info-form")}>
                <span>Số điện thoại:</span>
                {isAuth ? (
                  <span>{userInfo.phone_number}</span>
                ) : (
                  <input
                    value={guestInfo.phone_number}
                    onChange={handleEditGuestInfo}
                    name="phone_number"
                    type="text"
                    required
                  />
                )}
              </div>
            </div>
          </div>
          <div className={cx("cart-cover-delivery")}>
            <span>Hình thức giao hàng</span>
            <button type="button">
              <span>Giao tận nơi</span>
              <TruckIcon />
            </button>
          </div>
          <div className={cx("cart-cover-payment")}>
            <span>Hình thức thanh toán </span>
            <div className={cx("cart-cover-payment-method")}>
              <input
                type="radio"
                name="payment"
                id="traditional"
                checked={"traditional" === orderInfo.method}
                onChange={() => {
                  originalDispatch({
                    type: "CHANGE_PAYMENT_METHOD",
                    payload: "traditional",
                  });
                }}
                required
              />
              <label htmlFor="traditional">
                <MoneyIcon />
                <span>Thanh toán khi nhận hàng</span>
              </label>
            </div>
            <div className={cx("cart-cover-payment-method")}>
              <input
                type="radio"
                name="payment"
                id="vnpay"
                checked={"vnpay" === orderInfo.method}
                onChange={() => {
                  originalDispatch({
                    type: "CHANGE_PAYMENT_METHOD",
                    payload: "vnpay",
                  });
                }}
                required
              />
              <label htmlFor="vnpay">
                <img src={vnpay} style={{ width: "16px" }} />
                <span>Thanh toán bằng VNPAY</span>
              </label>
            </div>
          </div>
          <div className={cx("cart-cover-address")}>
            <div className={cx("cart-cover-address-title")}>
              <span>Địa chỉ giao hàng</span>
              {isAuth && (
                <button
                  onClick={() => navigate("/customer/dashboard")}
                  type="button"
                >
                  Chỉnh sửa
                </button>
              )}
            </div>
            <div className={cx("cart-cover-address-main")}>
              <div className={cx("cart-cover-info-form")}>
                <span>Tỉnh:</span>
                {isAuth ? (
                  <span>{userInfo.province}</span>
                ) : (
                  <input
                    value={guestInfo.guest_province}
                    onChange={handleEditGuestInfo}
                    name="province"
                    type="text"
                    required
                  />
                )}
              </div>
              <div className={cx("cart-cover-info-form")}>
                <span>Quận:</span>
                {isAuth ? (
                  <span>{userInfo.district}</span>
                ) : (
                  <input
                    value={guestInfo.guest_district}
                    onChange={handleEditGuestInfo}
                    name="district"
                    type="text"
                    required
                  />
                )}
              </div>
              <div className={cx("cart-cover-info-form")}>
                <span>Số nhà:</span>
                {isAuth ? (
                  <span>{userInfo.house_number}</span>
                ) : (
                  <input
                    value={guestInfo.guest_house_number}
                    onChange={handleEditGuestInfo}
                    name="house_number"
                    type="text"
                    required
                  />
                )}
              </div>
            </div>
          </div>
          <button className={cx("cart-cover-approve")} type="submit">
            Xác nhận
          </button>
        </div>
      </form>
      <ToastContainer style={{ top: "70px" }} />
    </div>
  );
}

export default memo(Cart);
