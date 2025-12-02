import { useEffect, useState } from "react";
import OutStockAlert from "../../../Component/OutStockAlert";
import ProductManagementTable from "../../../Component/ProductManagementTable";
import styles from "./Dashboard.module.scss";
import classNames from "classnames/bind";
import productService from "../../../api/productService";
import FilterForProductManagementTable from "../../../Component/FilterForProductManagementTable";
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

  console.log(productFilter);

  useEffect(() => {
    fetchProduct();
  }, [productFilter]);

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <FilterForProductManagementTable
          onChangeFilter={handleFilterChange}
          currentFilters={productFilter}
        />
        <ProductManagementTable productsDetail={productsDetail} />
      </div>
    </div>
  );
}

export default Dashboard;
