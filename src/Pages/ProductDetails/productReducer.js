import { error } from "ajv/dist/vocabularies/applicator/dependencies";

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
          ...base,
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
      let error = null;
      const _newServicePackages = state.servicePackages.map((_package) => {
        if (_package.packageId === _packageId) {
          const atLeastOneFilter = _package.items.filter(
            (item) => item.atLeastOne && item.selected
          );

          const newItems = _package.items.map((item) => {
            if (item.itemId === itemId) {
              if (
                item.selected &&
                item.atLeastOne &&
                atLeastOneFilter.length === 1
              ) {
                error = "Phải có ít nhất 1 dịch vụ VUA đc chọn";
                return {
                  ...item,
                };
              } else {
                return {
                  ...item,
                  selected: !item.selected,
                  error: null,
                };
              }
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
        error,
      };
    case "CHANGE_DISPLAY_IMG":
      const newDisplayImg = action.payload;
      return {
        ...state,
        displayImg: newDisplayImg,
      };
    case "SET_ERROR_DEFAULT":
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export { initialState, productReducer };
