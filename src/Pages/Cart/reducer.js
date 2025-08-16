export const initState = {
  cartItems: [],
  orderInfo: {
    cartId: "",
    method: "traditional",
  },
  loading: false,
  success: null,
  error: null,
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START": {
      return { ...state, loading: true, error: null, success: null };
    }
    case "FETCH_SUCCESS": {
      const { cartItems, cartId } = action.payload;
      return {
        ...state,
        cartItems: [...cartItems],
        orderInfo: {
          ...state.orderInfo,
          cartId: cartId,
        },
        loading: false,
        error: null,
      };
    }
    case "FETCH_ERROR": {
      const error = action.payload;
      return {
        ...state,
        loading: false,
        error: error,
      };
    }
    case "INCREASE_ITEM":
      const increaseItemId = action.payload;

      const increaseUpdatedCartItems = state.cartItems.map((item) =>
        item.cartItemId === increaseItemId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

      return {
        ...state,
        cartItems: [...increaseUpdatedCartItems],
        loading: false,
        error: null,
        success: null,
      };

    case "DECREASE_ITEM":
      const decreaseItemId = action.payload;

      const decreaseUpdatedCartItems = state.cartItems.map((item) =>
        item.cartItemId === decreaseItemId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );

      return {
        ...state,
        cartItems: [...decreaseUpdatedCartItems],
        loading: false,
        success: null,
      };
    case "DELETE_ITEM":
      const { deleteItemId, message } = action.payload;

      const newDeleteCartItems = state.cartItems.filter(
        (item) => item.cartItemId !== deleteItemId
      );

      return {
        ...state,
        cartItems: [...newDeleteCartItems],
        loading: false,
        success: message,
      };
    case "CHANGE_PAYMENT_METHOD":
      const paymentMethod = action.payload;
      console.log(paymentMethod);
      const newOrderInfo = {
        ...state.orderInfo,
        method: paymentMethod,
      };
      return {
        ...state,
        orderInfo: newOrderInfo,
      };
    case "CLEAR_CART":
      return {
        ...state,
        cartItems: [],
        orderInfo: {
          cartId: "",
          method: "traditional",
        },
      };
    default:
      return state;
  }
};
