import axiosClient from "./axiosClient";

const cartService = {
  getCartItem: () => {
    return axiosClient.get("/cart/get-cart-items");
  },
  createCartItem: (data) => {
    const { selectedVariant, servicePackageChoose } = data;
    return axiosClient.post("/cart/create-cart-item", {
      variant: selectedVariant,
      servicePackage: servicePackageChoose,
    });
  },
  decreaseItem: (cartItemId) => {
    return axiosClient.put("/cart/decrease-cart-item", { cartItemId });
  },
  increaseItem: (cartItemId) => {
    return axiosClient.put("/cart/increase-cart-item", { cartItemId });
  },
  deleteItem: (cartItemId) => {
    return axiosClient.put("/cart/delete-cart-item", { cartItemId });
  },
};

export default cartService;
