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

  const totalPrice = state.cartItems.reduce(
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

  const handleCreateOrder = (e) => {
    e.preventDefault();
    if (loading) return;
    const createOrderPromise = new Promise(async (resolve, reject) => {
      originalDispatch({ type: "FETCH_START" });
      try {
        const res = await orderService.createOrder(state.orderInfo);
        if (res.status === 201) {
          resolve("Đơn hàng đã được tạo thành công!");
          setCartItemQuant(0);
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

    toast.promise(createOrderPromise, {
      pending: "Đang tạo đơn hàng...",
      success: "Đơn hàng đã được tạo thành công! 🎉",
      error: {
        render({ data }) {
          return data.response.data.message || "Tạo đơn hàng thất bại";
        },
      },
    });
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
        >
          Thanh toán
        </button>
      )}

      <form
        className={cx("cart-cover", { show: showCover })}
        onSubmit={(e) => handleCreateOrder(e)}
      >
        <div className={cx("cart-cover-wrapper")}>
          <div className={cx("cart-cover-top")}>
            <span>Thông tin đơn hàng</span>
            <button onClick={() => setShowCover(false)} type="button">
              <ExistIcon />
            </button>
          </div>
          {!userInfo.is_profile_complete && (
            <div className={cx("cart-cover-warning")}>
              <span style={{ color: "red" }}>
                Vui lòng nhập/kiểm tra thông tin đặt hàng
              </span>
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
                <span>
                  {!!userInfo.full_name ? userInfo.full_name : "stamp"}
                </span>
              </div>
              <div className={cx("cart-cover-info-form")}>
                <span>Số điện thoại:</span>
                <span>
                  {!!userInfo.phone_number ? userInfo.phone_number : "stamp"}
                </span>
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
              <input
                type="radio"
                name="payment"
                checked={"traditional" === orderInfo.method}
                onChange={() => {}}
                required
              />
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
                <span>{!!userInfo.province ? userInfo.province : "stamp"}</span>
              </div>
              <div className={cx("cart-cover-info-form")}>
                <span>Quận:</span>
                <span>{!!userInfo.district ? userInfo.district : "stamp"}</span>
              </div>
              <div className={cx("cart-cover-info-form")}>
                <span>Số nhà:</span>
                <span>
                  {!!userInfo.house_number ? userInfo.house_number : "stamp"}
                </span>
              </div>
            </div>
          </div>
          <button className={cx("cart-cover-approve")} type="submit">
            Xác nhận
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}

export default memo(Cart);
