import { useEffect, useState } from "react";
import styles from "./FilterForProductManagementTable.module.scss";
import classNames from "classnames/bind";
import { brandService } from "../../api/brandService";
import { categoryService } from "../../api/categoryService";
import {
  BellIcon,
  IconShoppingBag,
  RemoveIcon,
  ResetIcon,
  SpecialArrowIcon,
} from "../../icons";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { formatNumber } from "../../utils/formatNumber";
import { notificationService } from "../../api/notificationService";
import { FilterIcon } from "../../icons";
import { Link, useNavigate } from "react-router";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../context/AuthContext";

const cx = classNames.bind(styles);

const lookupColor = {
  pending: "#f0d821",
  preparing: "#eb8c1b",
  shipping: "#2880ea",
  completed: "#1bb052",
  cancel: "#fe6347",
};

const lookupOrderTypes = {
  pending: "Chờ xử lý",
  preparing: "Đang chuẩn bị hàng",
  shipping: "Đang giao hàng",
  completed: "Giao hàng thành công",
  cancel: "Hủy",
};

function FilterForProductManagementTable({
  onChangeFilter,
  currentFilters = {},
  fetchProduct = () => {},
  fetchOrders = () => {},
  promotionMode = false,
  editMode = false,
  predictMode = false,
  orderMode = false,
  exportToExcel,
  orderTypes = [],
  handleAddPromotion = () => {},
  handleListPromotion = () => {},
  handleCheckVariants = () => {},
  handleOrderAddType = () => {},
  handleFilterOrderTypes = () => {},
  adminDashboard = false,
  customerDashboard = false,
}) {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showFilterList, setShowFilterList] = useState("");
  const [showNotification, setShowNotification] = useState(null);
  const [alertTab, setAlertTab] = useState("order");
  const [showFilterOption, setShowFilterOption] = useState(false);
  const { notificationState, isConnected } = useSocket();
  const navigate = useNavigate();

  const fetchBrandAndCategory = async () => {
    try {
      const resBrand = await brandService.getAllBrands();
      const resCategory = await categoryService.getAllCategories();
      setBrands(resBrand.data.data);
      setCategories(resCategory.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBrandAndCategory();
  }, []);

  const handleChangeBrand = (brand) => {
    onChangeFilter("brand", { id: brand.brand_id, name: brand.brand_name });
  };

  const handleChangeCategory = (category) => {
    onChangeFilter("category", {
      id: category.category_id,
      name: category.category_name,
    });
  };

  const handleChangeStatus = (status) => {
    onChangeFilter("status", status);
  };

  const brandList = (brand) => (
    <li
      key={brand.brand_id}
      onClick={() => handleChangeBrand(brand)}
      className={cx({
        chosen: brand.brand_name === currentFilters?.brand?.name,
      })}
    >
      {brand.brand_name.toUpperCase()}
    </li>
  );

  const categoryList = (category) => (
    <li
      key={category.category_id}
      onClick={() => handleChangeCategory(category)}
      className={cx({
        chosen: category.category_name === currentFilters?.category?.name,
      })}
    >
      {category.category_name.toUpperCase()}
    </li>
  );

  const handleReload = () => {
    fetchProduct();
    fetchOrders();
    if (promotionMode) handleCheckVariants({ clear: true });
  };

  const handleRemoveNotification = async ({ e, id }) => {
    e.stopPropagation();
    try {
      const res = await notificationService.deleteNotification(id);
    } catch (error) {
      console.error(error);
    }
  };

  const brandFilterBox = (
    <div
      className={cx("filter-box")}
      onMouseEnter={() => setShowFilterList("brand")}
      onMouseLeave={() => setShowFilterList("")}
    >
      <span
        className={cx("filter-title", {
          show: showFilterList === "brand",
        })}
      >
        Hãng
      </span>
      <span className={cx("filter-chosen")}>{currentFilters?.brand?.name}</span>
      <ul
        className={cx("filter-list", {
          show: showFilterList === "brand",
        })}
      >
        {brands.map(brandList)}
      </ul>
    </div>
  );

  const categoryFilterBox = (
    <div
      className={cx("filter-box")}
      onMouseEnter={() => setShowFilterList("category")}
      onMouseLeave={() => setShowFilterList("")}
    >
      <span
        className={cx("filter-title", {
          show: showFilterList === "category",
        })}
      >
        Loại
      </span>
      <span className={cx("filter-chosen")}>
        {currentFilters?.category?.name}
      </span>
      <ul
        className={cx("filter-list", {
          show: showFilterList === "category",
        })}
      >
        {categories.map(categoryList)}
      </ul>
    </div>
  );

  const productStatusFilterBox = (
    <div
      className={cx("filter-box")}
      onMouseEnter={() => setShowFilterList("status")}
      onMouseLeave={() => setShowFilterList("")}
    >
      <span
        className={cx("filter-title", {
          show: showFilterList === "status",
        })}
      >
        Trạng thái
      </span>
      <span className={cx("filter-chosen")}>
        {currentFilters?.status?.name}
      </span>
      <ul
        className={cx("filter-list", {
          show: showFilterList === "status",
        })}
        style={{ width: "fit-content" }}
      >
        <li
          onClick={() => handleChangeStatus({ id: 0, name: "hide" })}
          className={cx({
            chosen: "hide" === currentFilters?.status?.name,
          })}
        >
          ẩn
        </li>
        <li
          onClick={() => handleChangeStatus({ id: 1, name: "reveal" })}
          className={cx({
            chosen: "reveal" === currentFilters?.status?.name,
          })}
        >
          hiện
        </li>
      </ul>
    </div>
  );

  const orderFilter = (
    <div className={cx("filter-order")}>
      <div className={cx("filter-order-main")}>
        <button
          className={cx("filter-order-btn", { show: showFilterOption })}
          onClick={() => setShowFilterOption(!showFilterOption)}
        >
          <span>LỌC ĐƠN HÀNG</span>
          <FilterIcon />
        </button>
        <div className={cx("filter-order-option", { show: showFilterOption })}>
          <div
            className={cx("filter-order-option-wrapper", {
              show: showFilterOption,
            })}
          >
            <button
              onClick={() => handleOrderAddType("pending")}
              className={cx({ active: orderTypes.includes("pending") })}
            >
              Chờ sử lý
            </button>
            <button
              onClick={() => handleOrderAddType("preparing")}
              className={cx({ active: orderTypes.includes("preparing") })}
            >
              Đang chuẩn bị hàng
            </button>
            <button
              onClick={() => handleOrderAddType("shipping")}
              className={cx({ active: orderTypes.includes("shipping") })}
            >
              Đang giao
            </button>
            <button
              onClick={() => handleOrderAddType("completed")}
              className={cx({ active: orderTypes.includes("completed") })}
            >
              Giao thành công
            </button>
            <button
              onClick={() => handleOrderAddType("cancel")}
              className={cx({ active: orderTypes.includes("cancel") })}
            >
              Đã hủy
            </button>
          </div>
        </div>
      </div>
      <ul className={cx({ active: orderTypes.length })}>
        {orderTypes.map((type, id) => {
          return (
            <li key={id}>
              <span>{lookupOrderTypes[type]}</span>
              <button onClick={() => handleFilterOrderTypes(type)}>x</button>
            </li>
          );
        })}
      </ul>
    </div>
  );

  const productFilter = (
    <div className={cx("container")}>
      <h4>Lọc sản:</h4>
      <div className={cx("filter-container")}>
        {brandFilterBox} {categoryFilterBox}
        {productStatusFilterBox}
      </div>
    </div>
  );

  const { user } = useAuth();

  console.log(user);

  const handleRedirect = (order) => {
    if (parseInt(user.role_id) === 1) {
      navigate("/admin/invoice", {
        state: { order_id: order.order_id },
      });
    }

    if (parseInt(user.role_id) === 2) {
      console.log(parseInt(user.role_id) === 2);

      navigate("/customer/order", {
        state: { order_id: order.order_id },
      });
    }

    if (!user) {
      navigate("/order", {
        state: { order_id: order.order_id },
      });
    }
  };

  return (
    <div className={cx("wrapper")}>
      {!orderMode && productFilter}
      {orderMode && orderFilter}
      <div className={cx("utility")}>
        <Tippy content="Tải lại danh sách">
          <div className={cx("reset-list")}>
            <button onClick={handleReload}>
              <ResetIcon />
            </button>
          </div>
        </Tippy>

        <div
          className={cx("notification")}
          onClick={() => setShowNotification(!showNotification)}
        >
          <button
            className={cx("bell", {
              ring:
                notificationState?.inventoryAlerts.length ||
                notificationState?.orderAlerts.length,
            })}
          >
            <BellIcon />
          </button>

          <div
            className={cx("notification-list-wrapper", {
              show: showNotification === true,
              hide: showNotification === false,
            })}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={cx("notification-list-container")}>
              <div className={cx("notification-title")}>
                {adminDashboard && (
                  <div
                    className={cx("title_inventory", {
                      tab: alertTab === "inventory",
                    })}
                    onClick={() => setAlertTab("inventory")}
                  >
                    <span>Tồn kho</span>
                    <Tippy content={"số lượng thông báo"}>
                      <span>
                        {notificationState?.inventoryAlerts.length || 0}
                      </span>
                    </Tippy>
                  </div>
                )}
                <div
                  className={cx("title_order", {
                    tab: alertTab === "order",
                  })}
                  onClick={() => setAlertTab("order")}
                >
                  <span>Đơn hàng</span>
                  <Tippy content={"số lượng thông báo"}>
                    <span>{notificationState?.orderAlerts.length || 0}</span>
                  </Tippy>
                </div>
              </div>
              <div className={cx("blank")}>
                {adminDashboard && alertTab === "inventory" && (
                  <div className={cx("notification-list-inventory")}>
                    <div className={cx("inventory-wrapper")}>
                      {!notificationState?.inventoryAlerts.length && (
                        <h3>Không có thông báo</h3>
                      )}
                      {notificationState?.inventoryAlerts.map((alert, id) => {
                        const variant = alert.variant || {};
                        const [promotion] = variant?.promotions || [];
                        const discountPrice =
                          promotion &&
                          parseInt(variant.price) -
                            (parseInt(variant.price) *
                              parseInt(promotion.discount_value)) /
                              100;

                        return (
                          <div
                            className={cx("alert-wrapper")}
                            key={id}
                            onClick={() =>
                              navigate(
                                `/admin/edit-product/${alert.variant.product_id}`
                              )
                            }
                          >
                            <div className={cx("alert-item")}>
                              <div className={cx("alert-variant-img")}>
                                <img src={variant.image_url} />
                              </div>
                              <div className={cx("alert-variant-name-price")}>
                                <div className={cx("name")}>
                                  <span>{variant.variant_name}</span>
                                </div>
                                <div className={cx("price")}>
                                  <span className={cx({ discount: promotion })}>
                                    {formatNumber(parseInt(variant.price))}đ
                                  </span>
                                  <span className={cx({ discount: promotion })}>
                                    {promotion &&
                                      formatNumber(parseInt(discountPrice)) +
                                        "đ"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Tippy content="Xóa thông báo">
                              <button
                                className={cx("alert-remove")}
                                type="button"
                                onClick={(e) =>
                                  handleRemoveNotification({ e, id: alert.id })
                                }
                              >
                                <RemoveIcon />
                              </button>
                            </Tippy>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {alertTab === "order" && (
                  <div className={cx("notification-list-order")}>
                    <div className={cx("order-wrapper")}>
                      {!notificationState?.orderAlerts.length && (
                        <h3>Không có thông báo</h3>
                      )}
                      {notificationState?.orderAlerts.map((alert, id) => {
                        const order = alert.order || {};
                        const user = order.user;

                        return (
                          <div
                            className={cx("alert-wrapper")}
                            key={id}
                            onClick={() => handleRedirect(order)}
                          >
                            <div className={cx("alert-item")}>
                              <div
                                className={cx("alert-order-icon")}
                                style={{
                                  backgroundColor:
                                    lookupColor[order.order_status],
                                }}
                              ></div>
                              <div
                                className={cx("alert-order-customer-id-status")}
                              >
                                <div className={cx("id-status")}>
                                  <Tippy content="mã đơn">
                                    <span
                                      style={{
                                        color: lookupColor[order.order_status],
                                      }}
                                    >
                                      #{order.order_id}
                                    </span>
                                  </Tippy>
                                  <Tippy content="trạng thái đơn">
                                    <span
                                      style={{
                                        border: `2px solid ${
                                          lookupColor[order.order_status]
                                        }`,
                                      }}
                                    >
                                      {order.order_status}
                                    </span>
                                  </Tippy>
                                </div>
                                <div className={cx("customer")}>
                                  <span>{user?.full_name}</span>
                                  <span>{user?.phone_number}</span>
                                </div>
                              </div>
                            </div>
                            <Tippy content="Xóa thông báo">
                              <button
                                className={cx("alert-remove")}
                                type="button"
                                onClick={(e) =>
                                  handleRemoveNotification({
                                    e,
                                    id: alert.id,
                                  })
                                }
                              >
                                <RemoveIcon />
                              </button>
                            </Tippy>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {promotionMode && (
          <>
            <div className={cx("add-promotion")}>
              <button onClick={handleAddPromotion}>ADD PROMOTION</button>
            </div>
            <div className={cx("list-promotion")}>
              <button onClick={handleListPromotion}>SHOW PROMOTION</button>
            </div>
          </>
        )}

        {predictMode && (
          <>
            <div className={cx("export-excel")}>
              <button onClick={exportToExcel}>XUẤT EXCEL</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default FilterForProductManagementTable;
