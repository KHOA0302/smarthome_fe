import { useEffect, useState } from "react";
import styles from "./ProductDiscount.module.scss";
import classNames from "classnames/bind";
import productService from "../../api/productService";
import Product from "../../Component/Product";
const cx = classNames.bind(styles);
function ProductDiscount() {
  const [variants, setVariants] = useState([]);

  const fetchVariant = async () => {
    try {
      const res = await productService.getProductDiscount();
      setVariants(res.data.variants);
    } catch (error) {}
  };

  useEffect(() => {
    fetchVariant();
  }, []);

  console.log(variants);

  return (
    <div className={cx("wrapper")}>
      <h3>Sản phẩm giảm giá</h3>
      <div className={cx("container")}>
        {variants.map((variant) => {
          return <Product variant={variant} key={variant.variant_id} />;
        })}
      </div>
    </div>
  );
}

export default ProductDiscount;
