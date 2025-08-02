import { useEffect, useState } from "react";
import styles from "./ProductManagement.module.scss";
import classNames from "classnames/bind";
import productService from "../../../api/productService";
import { useNavigate } from "react-router";

const cx = classNames.bind(styles);
function ProductManagement() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await productService.getAllProducts();
        if (res.status === 200) {
          setProducts(res.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchAllProducts();
  }, []);

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("product-wrapper")}>
          <div
            className={cx("product")}
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {products.map((product, id) => {
              return (
                <button
                  onClick={() => navigate(`${product.product_id}`)}
                  key={id}
                >
                  {product.product_name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductManagement;
