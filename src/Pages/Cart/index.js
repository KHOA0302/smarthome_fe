import { useEffect, useReducer, useRef, useState } from "react";
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

  const handleCreateOrder = () => {
    const fetchCreateOrder = async () => {
      try {
        const res = await orderService.createOrder(state.orderInfo);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCreateOrder();
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
              <input
                type="radio"
                name="payment"
                checked={"traditional" === orderInfo.method}
                onChange={() => {}}
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
          <button
            className={cx("cart-cover-approve")}
            onClick={handleCreateOrder}
          >
            Xác nhận
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Cart;
