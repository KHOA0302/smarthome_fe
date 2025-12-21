import { useEffect, useState } from "react";
import styles from "./Promotion.module.scss";
import classNames from "classnames/bind";
import productService from "../../../api/productService";
import ProductManagementTable from "../../../Component/ProductManagementTable";
import FilterForProductManagementTable from "../../../Component/FilterForProductManagementTable";
import { formatNumber } from "../../../utils/formatNumber";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { promotionService } from "../../../api/promotionService";
import { toast, ToastContainer } from "react-toastify";
import PromotionList from "../../../Component/PromotionList";

const cx = classNames.bind(styles);

const initialFilterState = {
  brand: { id: "", name: "" },
  category: { id: "", name: "" },
  status: { id: "", name: "" },
};

function Promotion() {
  const [loading, setLoading] = useState(false);
  const [variants, setVariants] = useState([]);
  const [productFilter, setProductFilter] = useState(initialFilterState);
  const [checkedVariant, setCheckedVariant] = useState([]);
  const [showAddPromotionMoral, setShowAddPromotionMoral] = useState(null);
  const [showListPromotionMoral, setShowListPromotionMoral] = useState(null);
  const [promotionEvent, setPromotionEvent] = useState({
    name: "",
    discount: 0,
  });

  const fetchVariants = async () => {
    try {
      setLoading(true);
      const { brand, category, status } = productFilter;
      const res = await productService.getAllVariants(
        brand.id,
        category.id,
        status.id
      );
      setVariants(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchVariants();
  }, [productFilter]);

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

  const handleCheckVariants = ({ id, allowCheck = true, clear = false }) => {
    if (clear) {
      setCheckedVariant([]);
      return;
    }
    if (allowCheck || loading) return;

    console.log(id);

    if (checkedVariant.includes(id))
      setCheckedVariant((prev) => prev.filter((variant) => variant !== id));
    else setCheckedVariant((prev) => [...prev, id]);
  };

  const variantsAddPromotion = variants.filter((variant) =>
    checkedVariant.includes(variant.variant_id)
  );

  const handleAddPromotion = () => {
    if (!variantsAddPromotion.length || loading) return;
    setShowAddPromotionMoral(!showAddPromotionMoral);
    if (showListPromotionMoral !== null) setShowListPromotionMoral(false);
  };

  const handleListPromotion = () => {
    if (loading) return;
    setShowListPromotionMoral(!showListPromotionMoral);
    if (showAddPromotionMoral !== null) setShowAddPromotionMoral(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const promotionData = {
      promotion: promotionEvent,
      promotionVariants: checkedVariant,
    };

    try {
      setLoading(true);
      toast
        .promise(promotionService.createPromotion(promotionData), {
          pending: "Đang tải...",
          success: "Tạo Đợt giảm giá thành công! 🎉",
          error: "Đã xảy ra lỗi! 🤯",
        })
        .then((res) => {
          fetchVariants();
          setLoading(false);
          setShowAddPromotionMoral(false);
          setCheckedVariant([]);
        })
        .catch(() => {
          setLoading(false);
          setShowAddPromotionMoral(false);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const handleVariantStatus = async (variant, status) => {
    try {
      const res = await productService.editVariantStatus(
        variant.variant_id,
        status
      );

      const newStatus = status === true ? "in_stock" : "out_of_stock";
      const newVariants = variants.map((variantMap) => {
        if (variantMap.variant_id === variant.variant_id) {
          return {
            ...variant,
            item_status: newStatus,
          };
        }
        return variantMap;
      });
      setVariants(newVariants);
    } catch (error) {}
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <FilterForProductManagementTable
          onChangeFilter={handleFilterChange}
          currentFilters={productFilter}
          fetchProduct={fetchVariants}
          promotionMode={true}
          handleAddPromotion={handleAddPromotion}
          handleListPromotion={handleListPromotion}
          handleCheckVariants={handleCheckVariants}
        />
        <ProductManagementTable
          productsDetail={variants}
          promotionMode={true}
          loading={loading}
          handleCheckVariants={handleCheckVariants}
          checkedVariant={checkedVariant}
          handleVariantStatus={handleVariantStatus}
          onButton={true}
        />

        <PromotionList showListPromotionMoral={showListPromotionMoral} />
        <div
          className={cx("promotion-wrapper", {
            show: showAddPromotionMoral === true,
            hide: showAddPromotionMoral === false,
          })}
        >
          <div className={cx("promotion-container")}>
            <form className={cx("form")} onSubmit={handleSubmit}>
              <div className={cx("promotion-info")}>
                <div className={cx("promotion-name")}>
                  <label htmlFor="promotion-name">TÊN:</label>
                  <input
                    type="text"
                    id="promotion-name"
                    value={promotionEvent.name}
                    onChange={(e) =>
                      setPromotionEvent((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Nhập tên chương trình giảm giá"
                    required
                  />
                </div>
                <div className={cx("promotion-discount")}>
                  <label htmlFor="promotion-discount">%GIẢM:</label>
                  <input
                    type="text"
                    id="promotion-discount"
                    value={promotionEvent.discount}
                    onChange={(e) =>
                      setPromotionEvent((prev) => ({
                        ...prev,
                        discount: e.target.value,
                      }))
                    }
                    placeholder="Nhập số"
                    required
                  />
                </div>
              </div>
              <button type="submit">save</button>
            </form>
            <div className={cx("promotion-variant")}>
              {variantsAddPromotion.map((variant) => {
                return (
                  <div className={cx("variant-item")} key={variant.variant_id}>
                    <div className={cx("variant-img")}>
                      <img src={variant.image_url} />
                    </div>
                    <div className={cx("variant-name-price")}>
                      <span className={cx("name")}>{variant.variant_name}</span>
                      <div className={cx("price")}>
                        <span>{formatNumber(parseInt(variant.price))}đ</span>
                        {parseInt(promotionEvent.discount) > 0 && (
                          <span>
                            {formatNumber(
                              (parseInt(variant.price) *
                                (100 - parseInt(promotionEvent.discount))) /
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
                        {promotionEvent.discount}%
                      </div>
                    </Tippy>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Promotion;
