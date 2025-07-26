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
    case "SET_OPTION_VALUE":
      const { newAllOptions, newSelectedVariant } = action.payload;

      return {
        ...state,
        allOptions: [...newAllOptions],
        selectedVariant: newSelectedVariant,
      };
    case "SET_SERVICE_PACKAGE":
      const packageId = action.payload;
      const newServicePackages = state.servicePackages.map((_package) => {
        const newItems = _package.items.map((item) => {
          return {
            ...item,
            selected: true,
          };
        });

        return {
          ..._package,
          selected: _package.packageId === packageId,
          items: [...newItems],
        };
      });
      return {
        ...state,
        servicePackages: [...newServicePackages],
      };
    case "SET_SERVICE_PACKAGE_ITEM":
      const { _packageId, itemId } = action.payload;
      const _newServicePackages = state.servicePackages.map((_package) => {
        if (_package.packageId === _packageId) {
          const newItems = _package.items.map((item) => {
            if (item.itemId === itemId) {
              return {
                ...item,
                selected: !item.selected,
              };
            }
            return item;
          });

          return {
            ..._package,
            items: newItems,
          };
        }
        return _package;
      });
      return {
        ...state,
        servicePackages: [..._newServicePackages],
      };
    default:
      return state;
  }
};

export { initialState, productReducer };
