const initialBrandState = {
  brand: {
    name: "",
    img: null, // Hoặc giá trị khởi tạo phù hợp
  },
  brandsModified: [], // Ví dụ: [] hoặc một mảng khởi tạo từ props/context
  brands: [], // Danh sách các brand hiện có để kiểm tra sự tồn tại
  // Có thể thêm các state khác nếu cần, ví dụ: error messages, loading states...
};
function brandReducer(state, action) {
  switch (action.type) {
    case "UPDATE_BRAND_NAME": {
      const newName = action.payload.value.toLowerCase();
      const brandExists = state.brands.some((a) => a.brand_name === newName);

      if (brandExists) {
        // Cập nhật brand.name thành rỗng và set isExist cho brandsModified
        const newBrandsModified = state.brandsModified.map((b) => ({
          ...b,
          isExist: b.brand_name === newName, // Chỉ đặt isExist true cho brand khớp
        }));

        return {
          ...state,
          brand: {
            ...state.brand,
            name: "", // Đặt tên rỗng nếu đã tồn tại
          },
          brandsModified: newBrandsModified,
        };
      } else {
        // Cập nhật brand.name và đảm bảo isExist của tất cả brandsModified là false
        const newBrandsModified = state.brandsModified.map((b) => ({
          ...b,
          isExist: false,
        }));

        return {
          ...state,
          brand: {
            ...state.brand,
            name: action.payload.value, // Dùng giá trị gốc từ input
          },
          brandsModified: newBrandsModified,
        };
      }
    }
    case "UPDATE_BRAND_IMG":
      return {
        ...state,
        brand: {
          ...state.brand,
          img: action.payload.file,
        },
      };
    case "SET_BRANDS_DATA": // Để truyền dữ liệu brands từ bên ngoài vào reducer
      return {
        ...state,
        brands: action.payload.brands,
      };
    case "SET_BRANDS_MODIFIED_INITIAL": // Nếu brandsModified cần được khởi tạo từ đâu đó
      return {
        ...state,
        brandsModified: action.payload.brandsModified,
      };
    case "RESET_BRAND_FORM":
      return initialBrandState; // Hoặc một trạng thái reset cụ thể
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}
