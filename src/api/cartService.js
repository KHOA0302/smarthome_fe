import axiosClient from "./axiosClient";

const cartService = {
  getCartItem: () => {
    return axiosClient.get("/cart/get-cart-items");
  },
  createCartItem: (data) => {
    const { selectedVariant, optionValuesChoose, servicePackageChoose } = data;
    return axiosClient.post("/cart/create-cart-item", {
      variant: selectedVariant,
      servicePackage: servicePackageChoose,
    });
  },
};

export default cartService;
