import { useNavigate } from "react-router";
import { formatNumber } from "../../utils/formatNumber";
import styles from "./Product.module.scss";
import classNames from "classnames/bind";
import Tippy from "@tippyjs/react";
const cx = classNames.bind(styles);
function Product({ variant }) {
  const navigate = useNavigate();

  let discount = 0;
  if (variant.promotionVariants) {
    discount =
      variant.promotionVariants.length > 0 &&
      variant.promotionVariants[0].promotion.discount_value;
  } else {
    discount = variant["promotionVariants.promotion.discount_value"] || 0;
  }

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
              <div className={cx("variant-price")}>
                <span className={cx({ discount: discount > 0 })}>
                  {formatNumber(parseInt(variant.price))}đ
                </span>
                {discount > 0 && (
                  <span>
                    {formatNumber(
                      (parseInt(variant.price) * (100 - parseFloat(discount))) /
                        100
                    )}
                    đ
                  </span>
                )}
              </div>
              <span> {variant.product.sale_volume} đã bán</span>
            </div>
          </div>
        </div>
        {discount > 0 && (
          <Tippy content="Giảm giá">
            <div className={cx("discount-tag")}>
              <span>-{parseInt(discount)}%</span>
            </div>
          </Tippy>
        )}
      </div>
    </div>
  );
}

export default Product;
