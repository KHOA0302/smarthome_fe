import { useNavigate } from "react-router";
import { formatNumber } from "../../utils/formatNumber";
import styles from "./Product.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);
function Product({ variant }) {
  const navigate = useNavigate();

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div
          className={cx("variant")}
          onClick={() =>
            navigate(
              `/product/${variant.product.product_id}/variant/${variant.variant_id}`
            )
          }
        >
          <div className={cx("variant-img")}>
            <img src={variant.image_url} />
          </div>
          <div className={cx("variant-main")}>
            <span className={cx("variant-name")}>{variant.variant_name}</span>
            <div className={cx("variant-sold")}>
              <span>{formatNumber(parseInt(variant.price))}đ</span>
              <span> {variant.product.sale_volume} đã bán</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
