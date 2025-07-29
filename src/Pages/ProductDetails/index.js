import styles from "./ProductDetails.module.scss";
import classNames from "classnames/bind";
import { useEffect, useReducer, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import authService from "../../api/authService";
import cartService from "../../api/cartService";

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
    const fetchProductData = async () => {
      dispatch({ type: "FETCH_START" });
      try {
        const response = await productService.getProductDetails(
          product_id,
          variant_id
        );

        const data = response.data;
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        console.error("Error fetching product details:", error);
        dispatch({ type: "FETCH_ERROR", payload: error.message });
      }
    };

    fetchProductData();
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

  console.log(groupAttributes);

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

  const handleAddCart = () => {
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

    const fetchCreateCartItem = async () => {
      try {
        const res = await cartService.createCartItem(cartItems);
      } catch (error) {
        setIsOverQuantity(true);
        console.error(error.response.data.message);
      }
    };

    fetchCreateCartItem();
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div>
          <span>Máy giặc</span> {">"} <span>Máy giặc Aqua</span>
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
                {productDetails?.productImages.map((img, id) => {
                  return (
                    <div
                      className={cx("product-img", {
                        active: img.imgId === displayImg?.imgId,
                      })}
                      key={id}
                    >
                      <img src={img.imageUrl} />
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={cx("product-guarantees")}>
              <span>Smarthome xin đảm bảo</span>
              <span>{loading ? " loading" : " done"}</span>
              <span>{isOverQuantity && "quá hạn"}</span>
            </div>
            <div>
              <div className={cx("product-specifications")}>
                {specificationsHtml}
              </div>
              <div className={cx("product-des")}></div>
            </div>
            <div>
              <div className={cx("product-rating")}></div>
              <div className={cx("product-comment")}></div>
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
                <div className={cx("variant-service")}>
                  <span>Các gói dịch vụ</span>
                  <div className={cx("variant-service_packages")}>
                    {servicePackages?.map((sPackage, id) => {
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
                                onChange={() => handleChangePackage(sPackage)}
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
                                    setShowModalCover(!showModalCover);
                                  }}
                                >
                                  <div
                                    className={cx("service-overplay-wrapper")}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                    }}
                                  >
                                    <div
                                      className={cx("service-overplay-name")}
                                    >
                                      <span>{sPackage.packageName}</span>
                                      <button
                                        onClick={() =>
                                          setShowModalCover(!showModalCover)
                                        }
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
                                                    disabled={!item.selectable}
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
                                                    atLeastOne: item.atLeastOne,
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
                                    <div
                                      className={cx("service-overplay-bottom")}
                                    >
                                      <span>Tổng tiền</span>
                                      <span>{formatNumber(totalPrice)}đ</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                          </div>
                          {sPackage.selected && sPackage.items.length > 1 && (
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
                <div className={cx("variant-submit")}>
                  <button onClick={handleAddCart}>
                    <span>Thêm vào giỏ hàng</span>
                  </button>

                  <button>
                    <span>Mua hàng</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
