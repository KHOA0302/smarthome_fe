import { useEffect, useState } from "react";
import ProductManagementTable from "../../../Component/ProductManagementTable";
import styles from "./Dashboard.module.scss";
import classNames from "classnames/bind";
import productService from "../../../api/productService";
import FilterForProductManagementTable from "../../../Component/FilterForProductManagementTable";
import ChartForProductPrediction from "../../../Component/ChartForProductPrediction";
import * as XLSX from "xlsx";
import { useSocket } from "../../../context/SocketContext";
import { notificationService } from "../../../api/notificationService";

const cx = classNames.bind(styles);

const initialFilterState = {
  brand: { id: "", name: "" },
  category: { id: "", name: "" },
  status: { id: "", name: "" },
};

const exportToExcel = (
  productList,
  fileName = "Danh_sách_sản_phẩm_dự_đoán"
) => {
  const dataForExport = productList.map((product) => {
    const originalPrice = parseInt(product.price);
    const promotion = product?.promotionVariants[0]?.promotion;

    let finalPrice = originalPrice;
    if (promotion) {
      const discountValue = parseInt(promotion.discount_value);
      finalPrice = originalPrice - (originalPrice * discountValue) / 100;
    }

    const predictedSales = product?.predicted_order_next_quarter
      ? product.predicted_order_next_quarter.toFixed(2)
      : "N/A";

    return {
      "ID Variant": product.variant_id,
      "Tên Sản Phẩm": product.variant_name,
      "Tùy chọn": product.selectedOptionValues
        .map((v) => v.option_value_name)
        .join(", "),
      "Giá Gốc": originalPrice,
      "Khuyến Mãi Phần Trăm": promotion
        ? `${parseInt(promotion.discount_value)}%`
        : "0%",
      "Giá Cuối": finalPrice,
      "Tồn Kho": product.stock_quantity,
      "Danh Mục": product.product.category.category_name.toUpperCase(),
      "Thương Hiệu": product.product.brand.brand_name.toUpperCase(),
      "Dự đoán bán chạy": predictedSales,
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(dataForExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

function Dashboard() {
  const { lastMessage, isConnected } = useSocket();
  const [notifications, setNotifications] = useState({
    inventoryAlerts: [],
    orderAlerts: [],
  });
  const [loading, setLoading] = useState(false);
  const [productsDetail, setProductsDetail] = useState([]);
  const [productFilter, setProductFilter] = useState(initialFilterState);

  const handleFilterChange = (key, value) => {
    if (productFilter[key].name === value.name) {
      setProductFilter((prevFilters) => ({
        ...prevFilters,
        [key]: {
          id: "",
          name: "",
        },
      }));
      return;
    }
    setProductFilter((prevFilters) => ({
      ...prevFilters,
      [key]: {
        id: value.id,
        name: value.name,
      },
    }));
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { brand, category, status } = productFilter;
      const resProductService = await productService.getProductPrediction(
        brand.id,
        category.id,
        status.id
      );

      setProductsDetail(resProductService.data);
    } catch (error) {
      setLoading(false);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotification = async () => {
    try {
      setLoading(true);

      const resNotification = await notificationService.getNotificationAlert();
      setNotifications({
        ...notifications,
        inventoryAlerts: resNotification.data.data.variantsData,
      });
    } catch (error) {
      setLoading(false);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productFilter]);

  useEffect(() => {
    fetchNotification();
  }, []);

  useEffect(() => {
    switch (lastMessage.type) {
      case "NEW_INVENTORY_ALERT":
        const newInventoryAlert = [
          lastMessage,
          ...notifications.inventoryAlerts,
        ];
        setNotifications({
          ...notifications,
          inventoryAlerts: newInventoryAlert,
        });
        break;
      case "DELETE_INVENTORY_ALERT":
        setNotifications((prev) => ({
          ...prev,
          inventoryAlerts: prev.inventoryAlerts.filter(
            (alert) => alert.id !== lastMessage.id
          ),
        }));
        break;
      default:
        break;
    }
  }, [lastMessage]);

  const compositeProductPredictedData = productsDetail.reduce((acc, item) => {
    const brand = item.product.brand.brand_name;
    const category = item.product.category.category_name;
    const predicted_order_next_quarter = item.predicted_order_next_quarter;

    const key = `${brand}_${category}`;

    if (!acc[key]) {
      acc[key] = {
        brand: brand,
        category: category,
        totalStemp: 0,
      };
    }

    acc[key].totalStemp += predicted_order_next_quarter;

    return acc;
  }, {});

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <FilterForProductManagementTable
          onChangeFilter={handleFilterChange}
          currentFilters={productFilter}
          predictMode={true}
          fetchProduct={fetchProduct}
          exportToExcel={() => exportToExcel(productsDetail)}
          notifications={notifications}
          adminDashboard={true}
        />
        <ProductManagementTable
          productsDetail={productsDetail}
          loading={loading}
          predictMode={true}
        />
        <ChartForProductPrediction
          compositeProductPredictedData={Object.values(
            compositeProductPredictedData
          )}
        />
      </div>
    </div>
  );
}

export default Dashboard;
