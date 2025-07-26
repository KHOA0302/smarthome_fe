import { useEffect } from "react";
import styles from "./CartItem.module.scss";
import classNames from "classnames/bind";
import { formatNumber } from "../../utils/formatNumber";
import { ArrowRightIcon, EarthIcon, TrashIcon } from "../../icons";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

function CartItem({ cartItem }) {
  const { variant, services, options } = cartItem;
  const navigate = useNavigate();
  useEffect(() => {
    console.log(cartItem);
  }, []);
  const handleNavigator = (productId, variantId) => {
    navigate(`/product/${productId}/variant/${variantId}`);
  };
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div
          className={cx("cart-item-img")}
          onClick={() => handleNavigator(variant.productId, variant.variantId)}
        >
          <img src={variant.imageUrl} />
        </div>
        <div className={cx("cart-item-main")}>
          <div
            className={cx("cart-item-top")}
            onClick={() =>
              handleNavigator(variant.productId, variant.variantId)
            }
          >
            <span>{variant.variantName}</span>
            <span>{formatNumber(parseInt(cartItem.price))}đ</span>
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
            <button>
              <TrashIcon />
            </button>
            <div className={cx("cart-item-quantity")}>
              <button>-</button>
              <input value={cartItem.quantity} name="quantity" />
              <button>+</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
