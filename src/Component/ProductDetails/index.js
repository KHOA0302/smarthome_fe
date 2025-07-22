import styles from "./ProductDetails.module.scss";
import classNames from "classnames/bind";
import { useEffect, useReducer, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { initialState, productReducer } from "./productReducer";
import productService from "../../api/productService";
import { ArrowDownIcon, ArrowRightIcon } from "../../icons";
import banner from "../../images/girl.png";

const cx = classNames.bind(styles);
function ProductDetails() {
  const { product_id, variant_id } = useParams();
  const [state, dispatch] = useReducer(productReducer, initialState);

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

  const specificationsHtml = groupAttributes?.map((group, id) => {
    return (
      <div className={cx("attribute-wrapper")}>
        <div className={cx("attribute-container")}>
          <div className={cx("attribute-group")}>
            <span>{group.groupName}</span>
            <button>
              <ArrowDownIcon />
            </button>
          </div>
          <div className={cx("attribute-items")}>
            {group.attributes.map((attribute, id) => {
              return (
                <div className={cx("attribute-item")}>
                  <div>
                    <ArrowRightIcon />
                    <span>{attribute.attributeName}:</span>
                  </div>
                  <ul>
                    {attribute.attributeValues.map((av, id) => {
                      return <li>{av}</li>;
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
                          <li className={cx({ selected: ov.selected })} key={i}>
                            {ov.valueName}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
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
                    >
                      <div className={cx("variant-package_name")}>
                        <div>
                          <input
                            type="radio"
                            name="package"
                            checked={sPackage.selected}
                          />
                          <span>{sPackage.packageName}</span>
                        </div>
                        <span className={cx("total-price")}>
                          {totalPrice + "đ"}
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
                              >
                                <div>
                                  {item.atLeastOne ? (
                                    <span>👑</span>
                                  ) : (
                                    <span>☑️</span>
                                  )}

                                  <span>{item.itemName}</span>
                                </div>
                                {/* <span
                                className={cx("variant-service-item_price")}
                              >
                                {item.itemPriceImpact > 0 &&
                                  item.itemPriceImpact + "đ"}
                              </span> */}
                              </div>
                            );
                          }
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div></div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
