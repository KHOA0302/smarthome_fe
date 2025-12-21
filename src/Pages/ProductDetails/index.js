import styles from "./ProductDetails.module.scss";
import classNames from "classnames/bind";
import { useEffect, useReducer, useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { initialState, productReducer } from "./productReducer";
import productService from "../../api/productService";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  CheckBoxIcon,
  CircleCheckIcon,
  CrownIcon,
  ExistIcon,
  SpecialArrowIcon,
} from "../../icons";
import banner from "../../images/girl.png";
import { formatNumber } from "../../utils/formatNumber";
import cartService from "../../api/cartService";
import { useCartItemQuantContext } from "../../layout/CommonLayout";
import { toast, ToastContainer } from "react-toastify";
import sideTuff from "../../images/icon sp kem theo142836.png";
import warrant from "../../images/icon bao hanh170837.png";
import exchange from "../../images/Exchange232102.png";
import stroke from "../../images/stroke104155.png";
import ReviewSection from "../../Component/ReviewSection";

const cx = classNames.bind(styles);
function ProductDetails() {
  const { product_id, variant_id } = useParams();
  const [state, dispatch] = useReducer(productReducer, initialState);
  const navigate = useNavigate();
  const [showModalCover, setShowModalCover] = useState(false);
  const [expendGroups, setExpendGroups] = useState([]);
  const [isOverQuantity, setIsOverQuantity] = useState(false);

  const handleGroupExpand = (groupId) => {
    let newExpendGroup;
    if (expendGroups.includes(groupId)) {
      newExpendGroup = expendGroups.filter((expG, i) => expG !== groupId);
    } else {
      newExpendGroup = [...expendGroups, groupId];
    }
    setExpendGroups([...newExpendGroup]);
  };

  useEffect(() => {
    let ignore = false;
    const fetchProductData = async () => {
      dispatch({ type: "FETCH_START" });
      try {
        const response = await productService.getProductVariantDetails(
          product_id,
          variant_id
        );

        const data = response.data;

        if (!ignore) {
          dispatch({ type: "FETCH_SUCCESS", payload: data });
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        dispatch({ type: "FETCH_ERROR", payload: error.message });
      }
    };

    fetchProductData();

    return () => {
      ignore = true;
    };
  }, [product_id, variant_id]);

  const {
    loading,
    error,
    productDetails,
    selectedVariant,
    allOptions,
    allVariants,
    servicePackages,
    groupAttributes,
    displayImg,
  } = state;

  const handleOPtionValueChange = (optionId, valueId) => {
    const newAllOptions = allOptions.map((option) => {
      if (option.optionId === optionId) {
        const newOptionValues = option.optionValues.map((value) => {
          return {
            ...value,
            selected: value.valueId === valueId,
          };
        });

        return {
          ...option,
          optionValues: [...newOptionValues],
        };
      }
      return option;
    });

    const selectedValueIds = [];

    newAllOptions.forEach((option) => {
      option.optionValues.forEach((optionValue) => {
        if (optionValue.selected) {
          selectedValueIds.push(optionValue.valueId);
        }
      });
    });

    selectedValueIds.sort((a, b) => a - b);

    const newSelectedVariant = allVariants.filter((variant, id) => {
      return variant.optionValueIds.every(
        (value, index) => value === selectedValueIds[index]
      );
    })[0];

    if (newSelectedVariant && newSelectedVariant.variantId !== variant_id) {
      dispatch({
        type: "SET_OPTION_VALUE",
        payload: { newAllOptions, newSelectedVariant },
      });
      navigate(
        `/product/${product_id}/variant/${newSelectedVariant.variantId}`
      );
    }
  };

  const specificationsHtml = groupAttributes?.map((group, id) => {
    return (
      <div className={cx("attribute-wrapper")} key={id}>
        <div className={cx("attribute-container")}>
          <div
            className={cx("attribute-group")}
            onClick={() => handleGroupExpand(group.groupId)}
          >
            <span>{group.groupName}</span>
            <button
              className={cx({
                expend: expendGroups.includes(group.groupId),
              })}
            >
              <ArrowDownIcon />
            </button>
          </div>
          <div
            className={cx("attribute-items", {
              expend: expendGroups.includes(group.groupId),
            })}
          >
            {group.attributes.map((attribute, attributeMapId) => {
              return (
                <div className={cx("attribute-item")} key={attributeMapId}>
                  <div>
                    <ArrowRightIcon />
                    <span>{attribute.attributeName}:</span>
                  </div>
                  <ul>
                    {attribute.attributeValues.map((av, valueMapId) => {
                      return <li key={valueMapId}>{av}</li>;
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  });

  const handleChangePackage = (sPackage) => {
    if (!sPackage.selected) {
      dispatch({
        type: "SET_SERVICE_PACKAGE",
        payload: sPackage.packageId,
      });
    }
  };

  const changeServicePackageItems = (e, packageId, itemId) => {
    e.stopPropagation();
    dispatch({
      type: "SET_SERVICE_PACKAGE_ITEM",
      payload: { _packageId: packageId, itemId },
    });
  };

  useEffect(() => {
    let timer;
    if (isOverQuantity) {
      timer = setTimeout(() => {
        setIsOverQuantity(false);
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [isOverQuantity]);

  const { setCartItemQuant } = useCartItemQuantContext();

  const handleAddCart = (isNavigate = false) => {
    const promiseToast = new Promise(async (resolve, reject) => {
      try {
        const optionValuesChoose = allOptions.map((option) => {
          const newOptionValues = option.optionValues.filter(
            (value) => value.selected
          );

          return {
            ...option,
            optionValues: [...newOptionValues],
          };
        });

        const servicePackageChoose = servicePackages
          .filter((sp) => sp.selected)
          .map((sp) => {
            const newItems = sp.items.filter((item) => item.selected);
            return {
              ...sp,
              items: newItems,
            };
          })[0];

        const cartItems = {
          selectedVariant,
          optionValuesChoose,
          servicePackageChoose,
        };

        const res = await cartService.createCartItem(cartItems);

        if (res.status === 200) {
          const resCar = await cartService.getCartItem();
          if (resCar.status === 200) {
            setCartItemQuant(
              resCar.data.cartItems.reduce(
                (number, item) => item.quantity + number,
                0
              )
            );
          }
        }

        resolve(res);
      } catch (error) {
        setIsOverQuantity(true);
        reject(error);
      }
    });

    toast
      .promise(
        promiseToast,
        {
          pending: "Đang thêm sản phẩm...",
          success: "Thêm sản phẩm thành công!",
          error: "Thêm sản phẩm thất bại!.",
        },
        {
          toastClassName: "custom-toast-position",
        }
      )
      .then(() => {
        if (isNavigate) {
          navigate("/cart");
        }
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Lỗi không xác định.";
        toast.error(errorMessage);
      });
  };

  const handleChangeDisplayImg = (newDisplayImg) => {
    dispatch({ type: "CHANGE_DISPLAY_IMG", payload: newDisplayImg });
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div>
          <Link
            to="/"
            style={{
              color: "#959595ff",
              cursor: "pointer",
            }}
          >
            Home
          </Link>
          <span
            style={{
              fontSize: "2.4rem",
            }}
          >
            {" › "}
          </span>
          <Link
            to={`/product-list/${productDetails?.category.categoryName
              .trim()
              .replace(/ /g, "_")}/${
              productDetails?.category.categoryId
            }?page=1`}
            style={{
              color: "#959595ff",
              cursor: "pointer",
            }}
          >
            {productDetails?.category.categoryName}
          </Link>
          <span
            style={{
              fontSize: "2.4rem",
            }}
          >
            {" › "}
          </span>
          <span>
            {productDetails?.category.categoryName}{" "}
            {productDetails?.brand.brandName}
          </span>
        </div>
        <div className={cx("variant-name")}>
          <span>{selectedVariant?.variantName}</span>
        </div>
        <div className={cx("product-main")}>
          <section className={cx("product-section")}>
            <div className={cx("product-imgs")}>
              <div className={cx("product-imgs-display_area")}>
                <div className={cx("product-img_nav")}></div>
                <div className={cx("product-img_display")}>
                  <img src={displayImg?.imageUrl} />
                </div>
              </div>
              <div className={cx("product-imgs-choice_area")}>
                <div className={cx("choice_area-wrapper")}>
                  {productDetails?.productImages.map((img, id) => {
                    return (
                      <div
                        className={cx("product-img", {
                          active: img.imgId === displayImg?.imgId,
                        })}
                        onClick={() => handleChangeDisplayImg(img)}
                        key={id}
                      >
                        <img src={img.imageUrl} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className={cx("product-guarantees")}>
              <h3>Smarthome xin đảm bảo chất lượng sản phẩm </h3>
              <div className={cx("guarantees-container")}>
                <div className={cx("guarantees-item")}>
                  <img src={warrant} />
                  <span>Bảo hành chính hãng nhà sản xuất</span>
                </div>
                <div className={cx("guarantees-item")}>
                  <img src={stroke} />
                  <span>Phí vật tư có thể phát sinh thêm</span>
                </div>
                <div className={cx("guarantees-item")}>
                  <img src={exchange} />
                  <span>Hư gì đổi nấy, nhân viên đến tận nhà</span>
                </div>
                <div className={cx("guarantees-item")}>
                  <img src={sideTuff} />
                  <span>Thùng sản phẩm có các bộ điều khiển đi kèm</span>
                </div>
              </div>
            </div>
            <div>
              <div className={cx("product-specifications")}>
                {specificationsHtml}
              </div>
              <div className={cx("product-des")}></div>
            </div>
            <div>
              <ReviewSection
                productId={product_id}
                productName={productDetails?.productName}
              />
            </div>
          </section>
          <section className={cx("variant-section")}>
            <div className={cx("variant-banner")}>
              <img src={banner} />
            </div>
            <div className={cx("variant-options")}>
              {allOptions?.map((option, id) => {
                return (
                  <div key={id} className={cx("variant-option")}>
                    <span>{option.optionName}</span>
                    <ul>
                      {option.optionValues.map((ov, i) => {
                        return (
                          <li
                            className={cx({ selected: ov.selected })}
                            key={i}
                            onClick={() =>
                              handleOPtionValueChange(
                                option.optionId,
                                ov.valueId
                              )
                            }
                          >
                            {ov.valueName}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>

            <div className={cx("variant-service-wrapper")}>
              <div className={cx("variant-service-blank")}>
                {servicePackages.length ? (
                  <div className={cx("variant-service")}>
                    <span>Các gói dịch vụ</span>
                    <div className={cx("variant-service_packages")}>
                      {loading && <div className={cx("package-loading")}></div>}
                      {!loading &&
                        servicePackages?.map((sPackage, id) => {
                          const totalPrice =
                            sPackage.items.reduce((totalItemsPrice, item) => {
                              if (item.selected) {
                                return totalItemsPrice + item.itemPriceImpact;
                              }
                              return totalItemsPrice;
                            }, 0) + selectedVariant?.price;
                          return (
                            <div
                              className={cx("variant-service_package", {
                                selected: sPackage.selected,
                              })}
                              onClick={() => handleChangePackage(sPackage)}
                              key={id}
                            >
                              <div className={cx("variant-package_name")}>
                                <div>
                                  <input
                                    type="radio"
                                    name="package"
                                    checked={sPackage.selected}
                                    onChange={() =>
                                      handleChangePackage(sPackage)
                                    }
                                  />
                                  <span>{sPackage.packageName}</span>
                                </div>
                                <span className={cx("total-price")}>
                                  {formatNumber(totalPrice) + "đ"}
                                </span>
                              </div>
                              <div className={cx("variant-service_items")}>
                                {sPackage.items.map((item, i) => {
                                  if (item.selected) {
                                    return (
                                      <div
                                        className={cx("variant-service_item", {
                                          atLeastOne: item.atLeastOne,
                                          selected: item.selected,
                                        })}
                                        key={i}
                                      >
                                        <div
                                          className={cx(
                                            "variant-service_item-icons"
                                          )}
                                        >
                                          <div
                                            className={cx(
                                              "variant-service_item-icon"
                                            )}
                                          >
                                            {item.atLeastOne ? (
                                              <CrownIcon />
                                            ) : (
                                              <CircleCheckIcon />
                                            )}
                                          </div>

                                          <span>{item.itemName}</span>
                                        </div>
                                      </div>
                                    );
                                  }
                                })}
                                {showModalCover &&
                                  sPackage.selected &&
                                  sPackage.items.length > 1 && (
                                    <div
                                      className={cx("service-overplay")}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        dispatch({ type: "SET_ERROR_DEFAULT" });
                                        setShowModalCover(!showModalCover);
                                      }}
                                    >
                                      <div
                                        className={cx(
                                          "service-overplay-wrapper"
                                        )}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          dispatch({
                                            type: "SET_ERROR_DEFAULT",
                                          });
                                        }}
                                      >
                                        <div
                                          className={cx(
                                            "service-overplay-name"
                                          )}
                                        >
                                          <span>{sPackage.packageName}</span>
                                          <button
                                            onClick={() => {
                                              setShowModalCover(
                                                !showModalCover
                                              );
                                              dispatch({
                                                type: "SET_ERROR_DEFAULT",
                                              });
                                            }}
                                          >
                                            <ExistIcon />
                                          </button>
                                        </div>
                                        <div
                                          className={cx(
                                            "service-overplay-container"
                                          )}
                                        >
                                          <ul>
                                            {sPackage.items.map((item) => {
                                              return (
                                                <li key={item.itemId}>
                                                  <div>
                                                    {item.selectable ? (
                                                      <input
                                                        type="checkbox"
                                                        id={item.itemId}
                                                        disabled={
                                                          !item.selectable
                                                        }
                                                        checked={item.selected}
                                                        onClick={(e) => {
                                                          e.stopPropagation();
                                                        }}
                                                        onChange={(e) =>
                                                          changeServicePackageItems(
                                                            e,
                                                            sPackage.packageId,
                                                            item.itemId
                                                          )
                                                        }
                                                      />
                                                    ) : (
                                                      <CheckBoxIcon />
                                                    )}
                                                    <span
                                                      className={cx({
                                                        atLeastOne:
                                                          item.atLeastOne,
                                                      })}
                                                    >
                                                      {item.itemName}
                                                    </span>
                                                  </div>
                                                  <span>
                                                    {formatNumber(
                                                      item.itemPriceImpact
                                                    )}
                                                    đ
                                                  </span>
                                                </li>
                                              );
                                            })}
                                          </ul>
                                        </div>
                                        <span
                                          style={{
                                            color: "red",
                                            fontSize: "1.4rem",
                                            fontWeight: "800",
                                          }}
                                        >
                                          {error}
                                        </span>
                                        <div
                                          className={cx(
                                            "service-overplay-bottom"
                                          )}
                                        >
                                          <span>Tổng tiền</span>
                                          <span>
                                            {formatNumber(totalPrice)}đ
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                              </div>
                              {sPackage.selected &&
                                sPackage.items.length > 1 && (
                                  <button
                                    className={cx(
                                      "variant-service_package-item-edit_btn"
                                    )}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setShowModalCover(!showModalCover);
                                    }}
                                  >
                                    <span>Thay đổi dịch vụ</span>
                                    <SpecialArrowIcon />
                                  </button>
                                )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: "700",
                        fontSize: "1.8rem",
                      }}
                    >
                      Giá
                    </span>
                    <span
                      style={{
                        fontWeight: "800",
                        color: "darkorange",
                        fontSize: "2rem",
                      }}
                    >
                      {formatNumber(parseInt(selectedVariant?.price))}đ
                    </span>
                  </div>
                )}
                <div className={cx("variant-submit")}>
                  <button onClick={() => handleAddCart(false)}>
                    <span>Thêm vào giỏ hàng</span>
                  </button>

                  <button onClick={() => handleAddCart(true)}>
                    <span>Mua hàng</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <ToastContainer style={{ top: "70px" }} />
    </div>
  );
}

export default ProductDetails;
