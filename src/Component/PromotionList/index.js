import styles from "./PromotionList.module.scss";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { promotionService } from "../../api/promotionService";
import { formatNumber } from "../../utils/formatNumber";
import Tippy from "@tippyjs/react";
import { toast } from "react-toastify";
const cx = classNames.bind(styles);
function PromotionList({ showListPromotionMoral }) {
  const [promotions, setPromotions] = useState([]);

  const fetchPromotion = async () => {
    try {
      const res = await promotionService.getPromotion();
      setPromotions(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (promotion) => {
    const res = promotionService.deletePromotion(promotion.promotion_id);
    toast
      .promise(res, {
        pending: "Đang xóa Đợt Giảm Giá",
        success: "Xóa thành công👌",
        error: "Promise rejected 🤯",
      })
      .then((res) => {
        setPromotions((prev) =>
          prev.filter(
            (promotionMap) =>
              promotionMap.promotion_id != promotion.promotion_id
          )
        );
      });
  };

  useEffect(() => {
    fetchPromotion();
  }, [showListPromotionMoral]);

  if (!promotions.length)
    return (
      <div
        className={cx("promotion-wrapper", {
          show: showListPromotionMoral === true,
          hide: showListPromotionMoral === false,
        })}
      >
        <div className={cx("promotion-container")}>
          <h3 className={cx('non-promotion-title')}>Không có chương trình giảm giá nào</h3>
        </div>
      </div>
    );

  return (
    <div
      className={cx("promotion-wrapper", {
        show: showListPromotionMoral === true,
        hide: showListPromotionMoral === false,
      })}
    >
      <div className={cx("promotion-container")}>
        {promotions.map((promotion, id) => {
          return (
            <div className={cx("promotion-list")}>
              <div className={cx("promotion-main")}>
                <div className={cx("promotion-info")}>
                  <div className={cx("promotion-name")}>
                    <Tippy content="Tên đợt giảm giá">
                      <span>{promotion.promotion_name}</span>
                    </Tippy>
                  </div>

                  <div className={cx("promotion-discount")}>
                    <span>Giảm {parseInt(promotion.discount_value)}%</span>
                  </div>
                </div>
                <div className={cx("promotion-edit-btn")}>
                  <button type="button" onClick={() => handleDelete(promotion)}>
                    XÓA
                  </button>
                  <button type="button">SỬA</button>
                </div>
              </div>
              <div className={cx("promotion-variant")} key={id}>
                {promotion.promotionVariants.map((promotionVariant) => {
                  const variant = promotionVariant.variant;
                  return (
                    <div
                      className={cx("variant-item")}
                      key={variant.variant_id}
                    >
                      <div className={cx("variant-img")}>
                        <img src={variant.image_url} />
                      </div>
                      <div className={cx("variant-name-price")}>
                        <span className={cx("name")}>
                          {variant.variant_name}
                        </span>
                        <div
                          className={cx("price", {
                            discount: !!promotion.discount_value,
                          })}
                        >
                          <span>{formatNumber(parseInt(variant.price))}đ</span>
                          {parseInt(promotion.discount_value) > 0 && (
                            <span>
                              {formatNumber(
                                (parseInt(variant.price) *
                                  (100 - parseInt(promotion.discount_value))) /
                                  100
                              )}
                              đ
                            </span>
                          )}
                        </div>
                      </div>
                      <Tippy content="tồn kho">
                        <div className={cx("variant-inventory")}>
                          {variant.stock_quantity}
                        </div>
                      </Tippy>
                      <Tippy content="giảm giá">
                        <div className={cx("variant-discount")}>
                          {parseInt(promotion.discount_value)}%
                        </div>
                      </Tippy>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PromotionList;
