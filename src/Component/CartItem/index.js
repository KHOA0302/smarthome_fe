import styles from "./CartItem.module.scss";
import classNames from "classnames/bind";
import { formatNumber } from "../../utils/formatNumber";
import { ArrowRightIcon, TrashIcon } from "../../icons";
import { useNavigate } from "react-router-dom";
import Tippy from "@tippyjs/react";

const cx = classNames.bind(styles);

function CartItem({
  cartItem,
  handleDecreaseItem,
  handleIncreaseItem,
  handleDeleteItem,
}) {
  const { variant, services, options } = cartItem;
  const navigate = useNavigate();

  const handleNavigator = (productId, variantId) => {
    navigate(`/product/${productId}/variant/${variantId}`);
  };

  const discountValue =
    variant?.promotionVariant?.promotion?.discount_value || 0;

  const servicesPrice =
    services.reduce((ac, service) => {
      return ac + parseFloat(service.price);
    }, 0) || 0;

  const fullPrice = parseFloat(variant.price) + servicesPrice;

  const discountPrice =
    (parseInt(variant.price) * (100 - parseInt(discountValue))) / 100 +
      servicesPrice || null;

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div
          className={cx("cart-item-img")}
          onClick={() => handleNavigator(variant.productId, variant.variantId)}
        >
          <img src={variant.imageUrl} />

          {discountValue > 0 && (
            <Tippy content="Giảm giá">
              <div className={cx("discount-tag")}>
                <span>-{parseInt(discountValue)}%</span>
              </div>
            </Tippy>
          )}
        </div>
        <div className={cx("cart-item-main")}>
          <div
            className={cx("cart-item-top")}
            onClick={() =>
              handleNavigator(variant.productId, variant.variantId)
            }
          >
            <span>{variant.variantName}</span>
            <div className={cx("variant-price")}>
              <span className={cx({ discount: discountValue > 0 })}>
                {formatNumber(parseInt(fullPrice))}đ
              </span>
              {discountValue > 0 && (
                <span>{formatNumber(parseInt(discountPrice)) + "đ"}</span>
              )}
            </div>
          </div>
          <div className={cx("cart-item-option")}>
            {options.map((option, id) => (
              <div key={id}>
                <span>{option.optionName}</span>
                <span>{option.optionValue.valueName}</span>
              </div>
            ))}
          </div>
          <div className={cx("cart-item-service")}>
            <div>
              <span>Dịch vụ đi kèm:</span>
              <ul>
                {services.map((service, id) => (
                  <li key={id}>
                    <span>
                      <ArrowRightIcon />
                    </span>
                    <span>{service.serviceName}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className={cx("cart-item-bottom")}>
            <button onClick={() => handleDeleteItem(cartItem.cartItemId)}>
              <TrashIcon />
            </button>
            <div className={cx("cart-item-quantity")}>
              <button onClick={() => handleDecreaseItem(cartItem.cartItemId)}>
                -
              </button>
              <span>{cartItem.quantity}</span>
              <button onClick={() => handleIncreaseItem(cartItem.cartItemId)}>
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
