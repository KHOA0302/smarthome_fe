import { useEffect, useState } from "react";
import { formatNumber } from "../../utils/formatNumber";
import styles from "./ServiceEdit.module.scss";
import classNames from "classnames/bind";
import { serviceService } from "../../api/serviceService";
import { SelectableIcon, TrashIcon, UnSelectableIcon } from "../../icons";
import productService from "../../api/productService";
const cx = classNames.bind(styles);
function ServiceEdit({ category_id, servicePackages, variants, dispatch }) {
  const [serviceFilter, setServiceFilter] = useState([]);
  const [changeable, setChangeable] = useState(false);

  useEffect(() => {
    const fetchServiceFilter = async () => {
      try {
        const res = await serviceService.getServiceFilter(category_id);
        if (res.status === 200) {
          setServiceFilter(res.data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchServiceFilter();
  }, [category_id]);

  const combine = servicePackages.reduce((acc, currentItem) => {
    if (!acc[currentItem.variant_id]) {
      acc[currentItem.variant_id] = [];
    }
    acc[currentItem.variant_id].push({
      packageId: currentItem.packageId,
      packageName: currentItem.packageName,
      items: currentItem.items,
      isRemove: currentItem.isRemove,
    });

    return acc;
  }, {});

  const modifiedServicePackages = Object.keys(combine).map((key) => ({
    variant_id: parseInt(key),
    servicePackage: combine[key],
  }));

  const handleDispatch = (type, payload) => {
    dispatch({ type: type, payload: payload });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await productService.editService(servicePackages);
      if (res.status === 200) {
        console.log("sussed");
      }
    } catch (error) {
      console.error(error);
    }
    console.log(servicePackages);
  };

  return (
    <form className={cx("wrapper")} onSubmit={handleSubmit}>
      <div className={cx("container")}>
        <div className={cx("title")}>
          <h3>Phần dịch vụ biến thể</h3>
          <button
            className={cx({ change: changeable })}
            onClick={() => setChangeable(!changeable)}
            type="button"
          >
            SỬA
          </button>
        </div>

        <div className={cx("blank")}>
          <div className={cx("packages")}>
            {modifiedServicePackages.map((msp, id) => {
              return (
                <div className={cx("package")} key={id}>
                  <h4 className={cx("variant-name")}>
                    {
                      variants.find(
                        (variant) => variant.variant_id === msp.variant_id
                      ).variant_name
                    }
                  </h4>
                  <div className={cx("package-wrapper")}>
                    {msp.servicePackage.map((sp, id) => {
                      return (
                        <div className={cx("package-container")} key={id}>
                          <div className={cx("package-top")}>
                            <div
                              className={cx({
                                remove: sp.isRemove,
                              })}
                            >
                              {changeable ? (
                                <input
                                  type="text"
                                  value={sp.packageName}
                                  name="package-name"
                                  placeholder="Nhập tên gói..."
                                  required={!sp.isRemove}
                                  onChange={(e) =>
                                    handleDispatch("EDIT_PACKAGE_NAME", {
                                      editPackageNameValue: e.target.value,
                                      editNamePackageId: sp.packageId,
                                    })
                                  }
                                />
                              ) : (
                                <span>{sp.packageName}</span>
                              )}
                              {changeable && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDispatch(
                                      "DELETE_PACKAGE",
                                      sp.packageId
                                    )
                                  }
                                >
                                  <TrashIcon />
                                </button>
                              )}
                            </div>
                            <div>
                              <section></section>
                            </div>
                          </div>
                          <div
                            className={cx("package-bottom", {
                              remove: sp.isRemove,
                            })}
                          >
                            {sp.items.map((item, id) => {
                              return (
                                <div className={cx("package-item")} key={id}>
                                  {changeable && (
                                    <button
                                      className={cx("delete-item")}
                                      type="button"
                                      onClick={() =>
                                        handleDispatch("DELETE_SERVICE", {
                                          _deletePackageId: sp.packageId,
                                          deleteServiceId: item.itemId,
                                        })
                                      }
                                    >
                                      <TrashIcon />
                                    </button>
                                  )}
                                  <div
                                    className={cx("package-item-wrapper", {
                                      remove: item.isRemove,
                                    })}
                                  >
                                    <div className={cx("item-main")}>
                                      {changeable ? (
                                        <select
                                          name="service"
                                          value={item.serviceId}
                                          required={!item.isRemove}
                                          onChange={(e) =>
                                            handleDispatch(
                                              "EDIT_SERVICE_VALUE",
                                              {
                                                editServiceValueId:
                                                  e.target.value,
                                                editServiceValueName:
                                                  serviceFilter.find(
                                                    (service) =>
                                                      service.service_id ===
                                                      parseInt(e.target.value)
                                                  )?.service_name,
                                                editServiceValuePackageId:
                                                  sp.packageId,
                                                editServiceValueItemId:
                                                  item.itemId,
                                              }
                                            )
                                          }
                                        >
                                          <option value="">
                                            --Chọn dịch vụ--
                                          </option>
                                          {serviceFilter.map((sf, id) => {
                                            return (
                                              <option
                                                value={sf.service_id}
                                                key={id}
                                              >
                                                {sf.service_name}
                                              </option>
                                            );
                                          })}
                                        </select>
                                      ) : (
                                        <span>{item.itemName}</span>
                                      )}

                                      {changeable ? (
                                        <input
                                          name="price"
                                          type="text"
                                          value={formatNumber(
                                            item.itemPriceImpact
                                          )}
                                          required={!item.isRemove}
                                          onChange={(e) =>
                                            handleDispatch(
                                              "EDIT_SERVICE_PRICE",
                                              {
                                                editServicePriceValue:
                                                  e.target.value,
                                                editPricePackageId:
                                                  sp.packageId,
                                                editPriceServiceItemId:
                                                  item.itemId,
                                              }
                                            )
                                          }
                                        />
                                      ) : (
                                        <span>
                                          {formatNumber(
                                            parseInt(item.itemPriceImpact)
                                          )}
                                          đ
                                        </span>
                                      )}
                                    </div>
                                    <div className={cx("item-status")}>
                                      <button
                                        type="button"
                                        className={cx({
                                          selectable: item.selectable,
                                        })}
                                        onClick={() => {
                                          return (
                                            changeable &&
                                            handleDispatch(
                                              "EDIT_SERVICE_SELECTABLE",
                                              {
                                                editSelectAblePackageId:
                                                  sp.packageId,
                                                editSelectAbleItemId:
                                                  item.itemId,
                                              }
                                            )
                                          );
                                        }}
                                      >
                                        {item.selectable ? (
                                          <SelectableIcon />
                                        ) : (
                                          <UnSelectableIcon />
                                        )}
                                      </button>
                                      <button
                                        type="button"
                                        className={cx({
                                          ["at-least-one"]: item.atLeastOne,
                                        })}
                                        onClick={() => {
                                          return (
                                            changeable &&
                                            handleDispatch(
                                              "EDIT_SERVICE_AT_LEAST_ONE",
                                              {
                                                editAtLeastOnePackageId:
                                                  sp.packageId,
                                                editAtLeastOneItemId:
                                                  item.itemId,
                                              }
                                            )
                                          );
                                        }}
                                      >
                                        <span>1</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                            {changeable && (
                              <button
                                className={cx("add-service-btn")}
                                type="button"
                                onClick={() =>
                                  handleDispatch("ADD_SERVICE", sp.packageId)
                                }
                              >
                                THÊM DỊCH VỤ
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {changeable && (
                    <button
                      className={cx("add-package-btn")}
                      type="button"
                      onClick={() =>
                        handleDispatch("ADD_PACKAGE", msp.variant_id)
                      }
                    >
                      THÊM GÓI
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {changeable && (
        <button type="submit" className={cx("submit-btn")}>
          SUBMIT
        </button>
      )}
    </form>
  );
}

export default ServiceEdit;
