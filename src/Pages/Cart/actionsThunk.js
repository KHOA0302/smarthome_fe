import cartService from "../../api/cartService";

export const FETCH_START = "FETCH_START";
export const FETCH_SUCCESS = "FETCH_SUCCESS";
export const FETCH_ERROR = "FETCH_ERROR";
export const DELETE_ITEM = "DELETE_ITEM";
export const INCREASE_ITEM = "INCREASE_ITEM";
export const DECREASE_ITEM = "DECREASE_ITEM";

export const deleteItemThunk = (itemId) => async (dispatch) => {
  dispatch({ type: FETCH_START });
  try {
    const res = await cartService.deleteItem(itemId);
    if (res.status === 200) {
      dispatch({
        type: DELETE_ITEM,
        payload: {
          deleteItemId: itemId,
          message: "Xóa thành công!!",
        },
      });
    }
  } catch (error) {
    dispatch({ type: FETCH_ERROR, payload: "Xóa không thành công" });
  }
};

export const increaseItemThunk = (itemId) => async (dispatch) => {
  dispatch({ type: FETCH_START });
  try {
    const res = await cartService.increaseItem(itemId);
    if (res.status === 200) {
      dispatch({ type: INCREASE_ITEM, payload: itemId });
    } else {
      dispatch({
        type: FETCH_ERROR,
        payload: "Số lượng sản phẩm đã đạt giới hạn!!!",
      });
    }
  } catch (error) {
    dispatch({
      type: FETCH_ERROR,
      payload: "Số lượng sản phẩm đã đạt giới hạn!!!",
    });
  }
};

export const decreaseItemThunk = (itemId) => async (dispatch) => {
  dispatch({ type: FETCH_START });
  try {
    const res = await cartService.decreaseItem(itemId);
    if (res.status === 200) {
      const newIem = res.data;

      if (newIem.quantity === 0) {
        dispatch({ type: DELETE_ITEM, payload: itemId });
      } else {
        dispatch({ type: DECREASE_ITEM, payload: itemId });
      }
    }
  } catch (error) {
    dispatch({ type: FETCH_ERROR, payload: error.message });
  }
};
