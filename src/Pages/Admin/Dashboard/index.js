import { useEffect, useState } from "react";
import OutStockAlert from "../../../Component/OutStockAlert";
import ProductManagementTable from "../../../Component/ProductManagementTable";
import styles from "./Dashboard.module.scss";
import classNames from "classnames/bind";
import productService from "../../../api/productService";
import FilterForProductManagementTable from "../../../Component/FilterForProductManagementTable";
import ChartForProductPrediction from "../../../Component/ChartForProductPrediction";
import * as XLSX from "xlsx";

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

      const res = await productService.getProductPrediction(
        brand.id,
        category.id,
        status.id
      );

      setProductsDetail(res.data);
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
        <OutStockAlert />
        <FilterForProductManagementTable
          onChangeFilter={handleFilterChange}
          currentFilters={productFilter}
          predictMode={true}
          fetchProduct={fetchProduct}
          exportToExcel={() => exportToExcel(productsDetail)}
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
