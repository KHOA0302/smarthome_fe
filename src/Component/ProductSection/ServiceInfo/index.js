import { useEffect, useState } from "react";
import { TrashIcon, TrexIcon } from "../../../icons";
import styles from "./ServiceInfo.module.scss";
import classNames from "classnames/bind";
import { serviceService } from "../../../api/serviceService";

const cx = classNames.bind(styles);

function ServiceInfo({ productService, setProductService, productCategory }) {
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

  const handleAddPackage = () => {
    const packageService = {
      packageName: "",
      packageItem: [
        {
          category_id: productCategory,
          serviceId: "",
          serviceName: "",
          price: "",
          selectable: true,
          atLeastOne: false,
        },
      ],
      default: false,
    };

    setProductService([...productService, packageService]);
  };

  const handleRemovePackage = (idPackage) => {
    const newProductService = productService.filter((_, id) => {
      return id !== idPackage;
    });

    setProductService([...newProductService]);
  };

  const handleChangePackageName = (e, pkId) => {
    const newProductService = productService.map((ps, id) => {
      if (id === pkId) {
        return {
          ...ps,
          packageName: e.target.value,
        };
      }
      return ps;
    });

    setProductService([...newProductService]);
  };

  const handleAddServiceItem = (spId) => {
    const newPackageItem = {
      category_id: productCategory,
      serviceId: "",
      serviceName: "",
      price: "",
      selectable: true,
      atLeastOne: false,
    };
    const newProductService = productService.map((pv, id) => {
      if (id === spId) {
        return {
          ...pv,
          packageItem: [...pv.packageItem, newPackageItem],
        };
      }
      return pv;
    });

    setProductService([...newProductService]);
  };

  const handleChangeServiceSelect = (e, pkId, itemId) => {
    const newProductService = productService.map((ps, id) => {
      if (id === pkId) {
        const newPs = [...ps.packageItem];
        newPs[itemId].serviceId = e.target.value;

        return {
          ...ps,
          packageItem: [...newPs],
        };
      }
    });

    setProductService(newProductService);
  };

  const handlePriceChange = (e, pkId, itemId) => {
    const newProductService = productService.map((ps, id) => {
      if (id === pkId) {
        const newPs = [...ps.packageItem];
        newPs[itemId].price = e.target.value;
        return {
          ...ps,
          packageItem: [...newPs],
        };
      }

      return ps;
    });

    setProductService([...newProductService]);
  };

  console.log(productService);

  const handleStatusChange = (type, pkId, itemId) => {
    const newProductService = productService.map((ps, id) => {
      if (id === pkId) {
        let newPs = [...ps.packageItem];
        if (type === "selectable") {
          console.log(1, newPs[itemId].selectable);
          newPs[itemId].selectable = !ps.packageItem[itemId].selectable;
        } else if (type === "atLeastOne") {
          console.log(2, newPs[itemId].atLeastOne);
          newPs[itemId].atLeastOne = !ps.packageItem[itemId].atLeastOne;
        }

        return {
          ...ps,
          packageItem: [...newPs],
        };
      }
      return ps;
    });

    // setProductService([...newProductService]);
  };

  const handleRemoveServiceItem = (packageId, itemId) => {
    const newProductService = productService.map((pv, id) => {
      if (id === packageId) {
        const newPk = pv.packageItem.filter((_, i) => i !== itemId);
        return {
          ...pv,
          packageItem: [...newPk],
        };
      }
      return pv;
    });

    setProductService([...newProductService]);
  };

  const servicePackage = productService.map((sp, id) => {
    return (
      <div className={cx("service-container")} key={id}>
        <div className={cx("service-name")}>
          <div>
            <input
              type="text"
              placeholder="Nhập tên gói..."
              value={sp.packageName}
              id={id}
              onChange={(e) => handleChangePackageName(e, id)}
            />
          </div>
          <button type="button" onClick={() => handleRemovePackage(id)}>
            <TrashIcon />
          </button>
        </div>
        <div className={cx("service-item")}>
          {sp.packageItem.map((item, itemId) => {
            return (
              <div className={cx("service-item_row")} key={itemId}>
                <div className={cx("service-item_column")}>
                  <div className={cx("item-info")}>
                    <div>
                      <span>Tên dịch vụ</span>
                      <select
                        id="service"
                        onChange={(e) =>
                          handleChangeServiceSelect(e, id, itemId)
                        }
                        value={item.serviceId}
                      >
                        <option value="">--Chọn 1 dịch vụ--</option>
                        {serviceFilter.map((sf, id) => {
                          return (
                            <option value={sf.service_id} key={id}>
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
                        type="number"
                        value={item.price}
                        onChange={(e) => handlePriceChange(e, id, itemId)}
                      />
                    </div>
                  </div>

                  {sp.packageItem.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => handleRemoveServiceItem(id, itemId)}
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
                      hover: isHover === "selectable" + +itemId + id,
                      color: item.selectable,
                    })}
                    onMouseEnter={() => setIsHover("selectable" + itemId + id)}
                    onMouseLeave={() => setIsHover("")}
                    onClick={(e) =>
                      handleStatusChange("selectable", id, itemId)
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
                      hover: isHover === "atLeastOne" + +itemId + id,
                      color: item.atLeastOne,
                    })}
                    onMouseEnter={() => setIsHover("atLeastOne" + itemId + id)}
                    onMouseLeave={() => setIsHover("")}
                    onClick={(e) =>
                      handleStatusChange("atLeastOne", id, itemId)
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
        <button type="button" onClick={(e) => handleAddServiceItem(id)}>
          <span>Thêm dịch vụ</span>
        </button>
      </div>
    );
  });

  return (
    <section className={cx("service-section")}>
      <h1>Gói dịch vụ</h1>

      <div className={cx("service-wrapper")}>
        {servicePackage}
        <button type="button" onClick={handleAddPackage}>
          <span>Thêm gói dịch vụ</span>
        </button>
      </div>
    </section>
  );
}

export default ServiceInfo;
