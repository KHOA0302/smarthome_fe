const initState = {
  loading: true,
  error: null,
  district: "",
  email: "",
  houseNumber: "",
  id: "",
  isProfileComplete: false,
  name: "",
  phoneNumber: "",
  province: "",
  provinceSearchData: [],
  districtSearchData: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      const newUser = action.payload;

      return {
        ...state,
        ...newUser,
        loading: false,
      };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "EDIT-PHONE":
      const phone = action.payload;
      return {
        ...state,
        phoneNumber: phone,
      };
    case "EDIT-NAME":
      const name = action.payload;
      return {
        ...state,
        name: name,
      };
    case "EDIT-PROVINCE":
      const newProvince = action.payload;
      return {
        ...state,
        province: newProvince,
      };
    case "EDIT-DISTRICT":
      const newDistrict = action.payload;
      console.log(newDistrict);
      return {
        ...state,
        district: newDistrict,
      };
    case "EDIT-HOUSE-NUMBER":
      const newHouseNumber = action.payload;

      return {
        ...state,
        houseNumber: newHouseNumber,
      };
    case "SET-PROVINCE-SEARCH-DATA":
      const provinceSearchData = action.payload;

      return {
        ...state,
        provinceSearchData: [...provinceSearchData],
      };
    case "SET-DISTRICT-SEARCH-DATA":
      const districtSearchData = action.payload;
      return {
        ...state,
        districtSearchData: [...districtSearchData],
      };
    default:
      return state;
  }
};

export { reducer, initState };
