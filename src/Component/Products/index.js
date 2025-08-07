import styles from "./Products.module.scss";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import Product from "../Product";
import productService from "../../api/productService";
const cx = classNames.bind(styles);
function Products({ fetchProduct, title }) {
  const [variants, setVariants] = useState([]);
  const limit = 5;
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await fetchProduct(limit);

        if (res.status === 200) {
          setVariants(res.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetch();
  }, []);

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <h1>{title}</h1>
        <div
          className={cx("variants")}
          style={{ gridTemplateColumns: `repeat(${limit}, 1fr)` }}
        >
          {variants.map((variant, id) => {
            return <Product variant={variant} key={id} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default Products;
