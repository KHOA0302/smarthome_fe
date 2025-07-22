// productReducer.js
const initialState = {
  loading: true,
  error: null,
  productDetails: null,
  selectedVariant: null,
  allOptions: [],
  allVariants: [],
  servicePackages: [],
  groupAttributes: [],
};

const productReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      const {
        base,
        selectedVariant,
        allOptions,
        variants,
        servicePackages,
        groupAttributes,
      } = action.payload;

      return {
        ...state,
        loading: false,
        productDetails: {
          productId: base.productId,
          productName: base.productName,
          productImages: base.productImages,
        },
        selectedVariant: selectedVariant,
        allOptions: allOptions,
        allVariants: variants,
        servicePackages: servicePackages,
        groupAttributes: groupAttributes,
        displayImg: base.productImages[0],
      };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "SET_SELECTED_VARIANT":
      const newSelectedVariant = action.payload;
      const updatedAllOptions = state.allOptions.map((option) => ({
        ...option,
        optionValues: option.optionValues.map((value) => ({
          ...value,
          selected: newSelectedVariant.optionValueIds.includes(value.valueId),
        })),
      }));

      return {
        ...state,
        selectedVariant: newSelectedVariant,
        allOptions: updatedAllOptions, // Cập nhật lại allOptions để hiển thị trạng thái 'selected' đúng
      };
    default:
      return state;
  }
};

export { initialState, productReducer };
