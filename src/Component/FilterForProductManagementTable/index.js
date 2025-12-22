import { useEffect, useState } from "react";
import styles from "./FilterForProductManagementTable.module.scss";
import classNames from "classnames/bind";
import { brandService } from "../../api/brandService";
import { categoryService } from "../../api/categoryService";
import { BellIcon, RemoveIcon, ResetIcon, SpecialArrowIcon } from "../../icons";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { formatNumber } from "../../utils/formatNumber";
import { notificationService } from "../../api/notificationService";

const cx = classNames.bind(styles);
function FilterForProductManagementTable({
  onChangeFilter,
  currentFilters,
  fetchProduct,
  promotionMode = false,
  editMode = false,
  predictMode = false,
  exportToExcel,
  notifications = {
    inventoryAlerts: [],
    orderAlerts: [],
  },
  handleAddPromotion = () => {},
  handleListPromotion = () => {},
  handleCheckVariants = () => {},
  adminDashboard = false,
  customerDashboard = false,
}) {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showFilterList, setShowFilterList] = useState("");
  const [showNotification, setShowNotification] = useState(true);
  const [notifyTab, setNotifyTab] = useState("inventory");

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
      className={cx({ chosen: brand.brand_name === currentFilters.brand.name })}
    >
      {brand.brand_name.toUpperCase()}
    </li>
  );

  const categoryList = (category) => (
    <li
      key={category.category_id}
      onClick={() => handleChangeCategory(category)}
      className={cx({
        chosen: category.category_name === currentFilters.category.name,
      })}
    >
      {category.category_name.toUpperCase()}
    </li>
  );

  const handleReload = () => {
    fetchProduct();
    if (promotionMode) handleCheckVariants({ clear: true });
  };

  const handleRemoveNotification = async ({ e, id }) => {
    e.stopPropagation();
    try {
      const res = await notificationService.deleteNotification(id);
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <h4>Lọc sản:</h4>
        <div className={cx("filter-container")}>
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
            <span className={cx("filter-chosen")}>
              {currentFilters.brand.name}
            </span>
            <ul
              className={cx("filter-list", {
                show: showFilterList === "brand",
              })}
            >
              {brands.map(brandList)}
            </ul>
          </div>
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
              {currentFilters.category.name}
            </span>
            <ul
              className={cx("filter-list", {
                show: showFilterList === "category",
              })}
            >
              {categories.map(categoryList)}
            </ul>
          </div>

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
              {currentFilters.status.name}
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
                  chosen: "hide" === currentFilters.status.name,
                })}
              >
                ẩn
              </li>
              <li
                onClick={() => handleChangeStatus({ id: 1, name: "reveal" })}
                className={cx({
                  chosen: "reveal" === currentFilters.status.name,
                })}
              >
                hiện
              </li>
            </ul>
          </div>
        </div>
      </div>
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
          // onMouseEnter={() => setShowNotification(!showNotification)}
          // onMouseLeave={() => setShowNotification(!showNotification)}
        >
          <button
            className={cx("bell", {
              ring: notifications?.inventoryAlerts.length,
            })}
          >
            <BellIcon />
          </button>

          <div
            className={cx("notification-list-wrapper", {
              show: showNotification === true,
              hide: showNotification === false,
            })}
          >
            <div className={cx("notification-list-container")}>
              <div className={cx("notification-title")}>
                <div
                  className={cx("title_inventory", {
                    tab: notifyTab === "inventory",
                  })}
                  onClick={() => setNotifyTab("inventory")}
                >
                  <span>Tồn kho</span>
                  <Tippy content={"số lượng thông báo"}>
                    <span>{notifications?.inventoryAlerts.length || 0}</span>
                  </Tippy>
                </div>
                <div
                  className={cx("title_order", {
                    tab: notifyTab === "order",
                  })}
                  onClick={() => setNotifyTab("order")}
                >
                  <span>Đơn hàng</span>
                  <Tippy content={"số lượng thông báo"}>
                    <span>{notifications?.orderAlerts.length || 0}</span>
                  </Tippy>
                </div>
              </div>
              <div className={cx("blank")}>
                {adminDashboard && (
                  <div className={cx("notification-list-inventory")}>
                    <div className={cx("inventory-wrapper")}>
                      {!notifications?.inventoryAlerts.length && (
                        <h3>Không có thông báo</h3>
                      )}
                      {notifications?.inventoryAlerts.map((alert, id) => {
                        const variant = alert.variant;
                        const [promotion] = variant?.promotions;
                        const discountPrice =
                          promotion &&
                          parseInt(variant.price) -
                            (parseInt(variant.price) *
                              parseInt(promotion.discount_value)) /
                              100;

                        return (
                          <div className={cx("alert-wrapper")} key={id}>
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
                <div className={cx("notification-list-order")}>
                  <div className={cx("order-wrapper")}></div>
                </div>
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
