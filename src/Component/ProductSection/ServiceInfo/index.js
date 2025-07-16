import { useEffect, useState } from "react";
import { TrashIcon, TrexIcon } from "../../../icons";
import styles from "./ServiceInfo.module.scss";
import classNames from "classnames/bind";
import { serviceService } from "../../../api/serviceService";

const cx = classNames.bind(styles);

function ServiceInfo({
  productService,
  setProductService,
  productCategory,
  productVariant,
}) {
  const [isHover, setIsHover] = useState("");
  const [serviceFilter, setServiceFilter] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServicePackageFilter = async () => {
      try {
        const response = await serviceService.getServiceFilter(productCategory);
        if (response.data && response.data.data) {
          setServiceFilter(response.data.data);
        } else {
          setError(response.data.message || "Không có dữ liệu service.");
        }
        setLoading(false);
      } catch (err) {
        console.error("Lỗi khi fetch service:", err);

        setError(err.message || "Đã xảy ra lỗi khi tải các lựa chọn dịch vụ.");
        setLoading(false);
      }
    };

    fetchServicePackageFilter();
  }, [productCategory]);

  useEffect(() => {
    const ps = productVariant.map((pv, id) => {
      return {
        SKU: pv.sku,
        variantName: pv.variantName,
        packageServices: [],
        disable: true,
      };
    });

    setProductService([...ps]);
  }, [productVariant]);

  const handleAddPackage = (mapIdSku) => {
    const packageService = {
      packageName: "",
      packageItem: [
        {
          category_id: "",
          serviceId: "",
          serviceName: "",
          price: "",
          selectable: true,
          atLeastOne: false,
        },
      ],
      default: false,
    };

    const newProductService = productService.map((ps, id) => {
      if (id === mapIdSku) {
        return {
          ...ps,
          packageServices: [...ps.packageServices, packageService],
        };
      }

      return ps;
    });

    setProductService([...newProductService]);
  };

  const handleRemovePackage = (skuId, pkId) => {
    const newProductService = productService.map((ps, id) => {
      if (id === skuId) {
        const newPackageServices = [...ps.packageServices];

        const filterNewPackageServices = newPackageServices.filter((_, i) => {
          return i !== pkId;
        });

        return {
          ...ps,
          packageServices: [...filterNewPackageServices],
        };
      }

      return ps;
    });

    setProductService([...newProductService]);
  };

  const handleChangePackageName = (e, skuId, pkId) => {
    const newProductService = productService.map((ps, id) => {
      if (id === skuId) {
        const newPackageServices = [...ps.packageServices];

        newPackageServices[pkId].packageName = e.target.value;

        return {
          ...ps,
          packageServices: [...newPackageServices],
        };
      }

      return ps;
    });
    setProductService([...newProductService]);
  };

  const handleAddServiceItem = (skuId, packageId) => {
    const NewItem = {
      category_id: productCategory,
      serviceId: "",
      serviceName: "",
      price: "",
      selectable: true,
      atLeastOne: false,
    };
    const newProductService = productService.map((ps, id) => {
      if (id === skuId) {
        const newPackageServices = [...ps.packageServices];

        newPackageServices[packageId].packageItem = [
          ...newPackageServices[packageId].packageItem,
          NewItem,
        ];

        return {
          ...ps,
          packageServices: [...newPackageServices],
        };
      }
      return ps;
    });

    setProductService([...newProductService]);
  };

  const handleChangeServiceSelect = (e, skuId, pkSId, itemId) => {
    const newProductService = productService.map((ps, id) => {
      if (id === skuId) {
        const newPackageServices = [...ps.packageServices];

        newPackageServices[pkSId].packageItem[itemId].serviceId =
          e.target.value;

        newPackageServices[pkSId].packageItem[itemId].category_id =
          e.target.selectedOptions[0].dataset.categoryId;

        return {
          ...ps,
          packageServices: [...newPackageServices],
        };
      }

      return ps;
    });

    setProductService([...newProductService]);
  };

  const handlePriceChange = (e, skuId, pkSId, itemId) => {
    const newProductService = productService.map((ps, id) => {
      if (id === skuId) {
        const newPackageServices = [...ps.packageServices];
        const priceNumber = e.target.value.replace(/\D/g, "");
        const formattedValue = new Intl.NumberFormat("vi-VN").format(
          parseInt(priceNumber, 10)
        );
        newPackageServices[pkSId].packageItem[itemId].price = formattedValue;

        return {
          ...ps,
          packageServices: [...newPackageServices],
        };
      }
      return ps;
    });

    setProductService([...newProductService]);
  };

  const handleStatusChange = (type, skuId, pkId, itemId) => {
    const newProductService = productService.map((ps, id) => {
      if (id === skuId) {
        let newPackageServices = [...ps.packageServices];
        if (type === "selectable") {
          newPackageServices[pkId].packageItem[itemId].selectable =
            !ps.packageServices[pkId].packageItem[itemId].selectable;
        } else if (type === "atLeastOne") {
          newPackageServices[pkId].packageItem[itemId].atLeastOne =
            !ps.packageServices[pkId].packageItem[itemId].atLeastOne;
        }

        return {
          ...ps,
          packageServices: [...newPackageServices],
        };
      }
      return ps;
    });

    setProductService([...newProductService]);
  };

  const handleRemoveServiceItem = (skuId, packageId, itemId) => {
    const newProductService = productService.map((ps, id) => {
      if (id === skuId) {
        const newPackageServices = [...ps.packageServices];
        const newPackageItems = newPackageServices[
          packageId
        ].packageItem.filter((_, i) => {
          return i !== itemId;
        });

        newPackageServices[packageId].packageItem = [...newPackageItems];

        return {
          ...ps,
          packageServices: [...newPackageServices],
        };
      }

      return ps;
    });

    setProductService([...newProductService]);
  };

  const servicePackageUi = productService.map((ps, id) => {
    const a = ps.packageServices.map((pkS, pkSId) => {
      return (
        <div className={cx("service-container")} key={pkSId}>
          <div className={cx("service-name")}>
            <div>
              <input
                type="text"
                placeholder="Nhập tên gói..."
                value={pkS.packageName}
                id={pkSId}
                onChange={(e) => handleChangePackageName(e, id, pkSId)}
                required
              />
            </div>

            <button
              type="button"
              onClick={() => handleRemovePackage(id, pkSId)}
            >
              <TrashIcon />
            </button>
          </div>
          <div className={cx("service-item")}>
            {pkS.packageItem.map((item, itemId) => {
              return (
                <div className={cx("service-item_row")} key={itemId}>
                  <div className={cx("service-item_column")}>
                    <div className={cx("item-info")}>
                      <div>
                        <span>Tên dịch vụ</span>
                        <select
                          id="service"
                          onChange={(e) =>
                            handleChangeServiceSelect(e, id, pkSId, itemId)
                          }
                          value={item.serviceId}
                          required
                        >
                          <option value="">--Chọn 1 dịch vụ--</option>
                          {serviceFilter.map((sf, sfId) => {
                            return (
                              <option
                                value={sf.service_id}
                                key={sfId}
                                data-category-id={sf.category_id}
                              >
                                {sf.service_name}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <div>
                        <label htmlFor={itemId}>Giá</label>
                        <input
                          id={itemId}
                          name="price"
                          type="text"
                          value={item.price}
                          onChange={(e) =>
                            handlePriceChange(e, id, pkSId, itemId)
                          }
                          required
                        />
                      </div>
                    </div>

                    {pkS.packageItem.length > 1 ? (
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveServiceItem(id, pkSId, itemId)
                        }
                      >
                        <TrashIcon />
                      </button>
                    ) : (
                      <button type="button">
                        <TrexIcon />
                      </button>
                    )}
                  </div>
                  <div className={cx("service-item_column")}>
                    <div
                      className={cx("item-status", {
                        hover: isHover === "selectable" + itemId + pkSId + id,
                        color: item.selectable,
                      })}
                      onMouseEnter={() =>
                        setIsHover("selectable" + itemId + pkSId + id)
                      }
                      onMouseLeave={() => setIsHover("")}
                      onClick={(e) =>
                        handleStatusChange("selectable", id, pkSId, itemId)
                      }
                    >
                      {item.selectable ? (
                        <span>Chọn được</span>
                      ) : (
                        <span>Không chọn được</span>
                      )}
                    </div>
                    <div
                      className={cx("item-status", {
                        hover: isHover === "atLeastOne" + itemId + pkSId + id,
                        color: item.atLeastOne,
                      })}
                      onMouseEnter={() =>
                        setIsHover("atLeastOne" + itemId + pkSId + id)
                      }
                      onMouseLeave={() => setIsHover("")}
                      onClick={(e) =>
                        handleStatusChange("atLeastOne", id, pkSId, itemId)
                      }
                    >
                      {item.atLeastOne ? (
                        <span>Ít nhất 1</span>
                      ) : (
                        <span>Không</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <button
            type="button"
            onClick={(e) => handleAddServiceItem(id, pkSId, id)}
          >
            <span>Thêm dịch vụ</span>
          </button>
        </div>
      );
    });

    return (
      <div className={cx("service-blank")} key={id}>
        <h3>Tên biến thể: {ps.variantName}</h3> {a}
        <button type="button" onClick={() => handleAddPackage(id)}>
          <span>Thêm gói dịch vụ</span>
        </button>
      </div>
    );
  });

  return (
    <section className={cx("service-section")}>
      <h1>Gói dịch vụ</h1>
      <div className={cx("service-wrapper")}>{servicePackageUi}</div>
    </section>
  );
}

export default ServiceInfo;
