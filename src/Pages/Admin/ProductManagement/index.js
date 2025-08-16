import { useEffect, useState } from "react";
import styles from "./ProductManagement.module.scss";
import classNames from "classnames/bind";
import productService from "../../../api/productService";
import { Link } from "react-router-dom";
import { TrashIcon } from "../../../icons";
import { toast, ToastContainer } from "react-toastify";

const cx = classNames.bind(styles);

function searchProductsByName(products, searchTerm) {
  const lowerCaseSearchTerm = searchTerm.toLowerCase();

  const results = products.filter((product) => {
    if (
      product &&
      product.product_name &&
      typeof product.product_name === "string"
    ) {
      return product.product_name.toLowerCase().includes(lowerCaseSearchTerm);
    }
    return false;
  });

  return results;
}
function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [searchProductResult, setSearchProductResult] = useState([]);
  const [filters, setFilters] = useState({
    brandId: null,
    categoryId: null,
  });

  useEffect(() => {
    const fetchAllProducts = async () => {
      const fetchPromise = productService.getAllProductsByFilter(filters);

      toast.promise(fetchPromise, {
        pending: "Đang tải danh sách sản phẩm...",
        success: {
          render({ data }) {
            setProducts(data.data);
            setSearchProductResult(data.data);
            return "Tải sản phẩm thành công!";
          },
        },
        error: "Có lỗi xảy ra khi tải sản phẩm.",
      });
    };
    fetchAllProducts();
  }, []);

  const handleSearchProduct = (e) => {
    const newSearchProductResult = searchProductsByName(
      products,
      e.target.value
    );

    setSearchProductResult(newSearchProductResult);
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("products")}>
          <div className={cx("product-search")}>
            <input type="text" onChange={handleSearchProduct} />
            <button>TÌM KIẾM</button>
          </div>
          <div
            className={cx("products-container")}
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {searchProductResult.map((product, id) => {
              return (
                <div className={cx("product")} key={id}>
                  <div className={cx("product-blank")}></div>
                  <Link
                    to={`${product.product_id}`}
                    key={id}
                    className={cx("product-link")}
                  >
                    <div className={cx("product-info")}>
                      <h3>{product.product_name}</h3>
                      <div>
                        <span>{product.category.category_name}</span>
                        <span>{product.brand.brand_name}</span>
                      </div>
                    </div>
                  </Link>
                  <div
                    className={cx("product-delete")}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className={cx({
                        disable: product.hasVariant > 0,
                      })}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <TrashIcon />
                    </button>
                    {product.hasVariant > 0 && (
                      <span className={cx("delete-popup")}>
                        Sản phẩm có tồn tại biến thể
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ProductManagement;
