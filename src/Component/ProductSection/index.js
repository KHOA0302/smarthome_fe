import { memo, useState } from "react";
import styles from "./ProductSection.module.scss";
import classNames from "classnames/bind";
import VariantInfo from "./VariantInfo";
import BaseInfo from "./BaseInfo";
import ServiceInfo from "./ServiceInfo";
import {
  uploadImageToFirebase,
  uploadMultipleImagesToFirebase,
} from "../../utils/firebaseUpload";
import productServiceApi from "../../api/productService";
import AttributeInfo from "./AttributeInfo";
import { toast, ToastContainer } from "react-toastify";

const cx = classNames.bind(styles);

function ProductSection() {
  const [isSave, setIsSave] = useState(false);
  const [loading, setLoading] = useState(true);
  const [productBase, setProductBase] = useState({
    name: "",
    brand: "",
    category: "",
    des: "",
    imgs: [],
  });

  const [productOption, setProductOption] = useState([
    {
      optionId: "",
      optionValue: [""],
    },
  ]);

  const [productVariant, setProductVariant] = useState([]);

  const [productService, setProductService] = useState([]);

  const [productAttribute, setProductAttribute] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loading) return;

    const submitPromise = new Promise(async (resolve, reject) => {
      setLoading(true);
      try {
        const baseImageUrls = await uploadMultipleImagesToFirebase(
          productBase.imgs,
          "basic"
        );

        const updatedProductBase = {
          ...productBase,
          imgs: baseImageUrls,
        };

        const updatedVariants = await Promise.all(
          productVariant
            .filter((variant) => !variant.isRemove)
            .map(async (variant) => {
              if (variant.img && variant.img instanceof File) {
                const variantImageUrl = await uploadImageToFirebase(
                  variant.img,
                  "variant"
                );

                return { ...variant, img: variantImageUrl };
              }

              return { ...variant };
            })
        );

        const updateServices = productService.filter(
          (ps) => ps.packageServices.length > 0
        );

        const updateAttributes = productAttribute
          .filter((pa) => !pa.isRemove)
          .map((pa) => {
            const newAttributes = pa.attributes.filter(
              (attr) => !attr.isRemove
            );
            return {
              ...pa,
              attributes: newAttributes,
            };
          });

        const finalProductData = {
          basic: updatedProductBase,
          options: productOption,
          variants: updatedVariants,
          services: updateServices,
          attributes: updateAttributes,
        };

        const response = await productServiceApi.createProduct(
          finalProductData
        );

        if (response.data && response.data.data) {
          resolve(response);
          setIsSave(true);
        } else {
          reject(response.data.message || "Không có dữ liệu option.");
        }
        setLoading(false);
        resolve(response);
      } catch (error) {
        console.error("Lỗi trong quá trình submit:", error);
        reject(error);
      } finally {
        setLoading(false);
      }
    });

    toast.promise(submitPromise, {
      pending: "Đang xử lý...",
      success: "Thành công! 🎉",
      error: {
        render({ data }) {
          return "Lỗi khi lưu sản phẩm";
        },
      },
    });
  };

  const handleClear = () => {
    setIsSave(false);
    setProductBase({
      name: "",
      brand: "",
      category: "",
      des: "",
      imgs: [],
    });

    setProductOption([
      {
        optionId: "",
        optionValue: [""],
      },
    ]);
    setProductVariant([]);
    setProductService([]);
    setProductAttribute([]);
    toast.success("Đã làm sạch form nhập liệu");
  };

  return (
    <form onSubmit={handleSubmit} className={cx("form")}>
      <div className={cx("product-form")}>
        <BaseInfo productBase={productBase} setProductBase={setProductBase} />
        <VariantInfo
          productOption={productOption}
          setProductOption={setProductOption}
          productVariant={productVariant}
          setProductVariant={setProductVariant}
          productName={productBase.name}
          productCategory={productBase.category}
        />

        <ServiceInfo
          productService={productService}
          setProductService={setProductService}
          productCategory={productBase.category}
          productVariant={productVariant}
        />

        <AttributeInfo
          productAttribute={productAttribute}
          setProductAttribute={setProductAttribute}
          productCategory={productBase.category}
        />

        {isSave ? (
          <button type="submit" className={cx("submit")}>
            Gửi
          </button>
        ) : (
          <button
            onClick={handleClear}
            type="button"
            className={cx("clear-btn")}
            style={{
              backgroundColor: "darkblue",
              color: "white",
              border: "none",
              padding: "2px 4px",
              borderRadius: "4px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Clear
          </button>
        )}
      </div>

      <ToastContainer />
    </form>
  );
}

export default memo(ProductSection);
