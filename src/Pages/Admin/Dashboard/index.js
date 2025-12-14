import { useEffect, useState } from "react";
import OutStockAlert from "../../../Component/OutStockAlert";
import ProductManagementTable from "../../../Component/ProductManagementTable";
import styles from "./Dashboard.module.scss";
import classNames from "classnames/bind";
import productService from "../../../api/productService";
import FilterForProductManagementTable from "../../../Component/FilterForProductManagementTable";
import ChartForProductPrediction from "../../../Component/ChartForProductPrediction";
const cx = classNames.bind(styles);

const initialFilterState = {
  brand: { id: "", name: "" },
  category: { id: "", name: "" },
  status: { id: "", name: "" },
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
          fetchProduct={fetchProduct}
        />
        <ProductManagementTable
          productsDetail={productsDetail}
          loading={loading}
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
