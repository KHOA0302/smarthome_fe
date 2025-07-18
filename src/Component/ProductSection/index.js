import { useState } from "react";
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

const cx = classNames.bind(styles);

function ProductSection() {
  const [error, setError] = useState(null);
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
    try {
      const productIdentifier =
        productBase.name.replace(/\s+/g, "_").toLowerCase() ||
        `new_product_${Date.now()}`;

      const baseImageUrls = await uploadMultipleImagesToFirebase(
        productBase.imgs,
        "basic",
        productIdentifier
      );

      const updatedProductBase = {
        ...productBase,
        imgs: baseImageUrls,
      };

      const updatedVariants = await Promise.all(
        productVariant.map(async (variant) => {
          if (!variant.isRemove) {
            if (variant.img && variant.img instanceof File) {
              const variantIdentifier =
                variant.sku ||
                `${productIdentifier}_${variant.combination.join("-")}`;
              const variantImageUrl = await uploadImageToFirebase(
                variant.img,
                "variant",
                variantIdentifier
              );

              return { ...variant, img: variantImageUrl };
            }

            return { ...variant };
          }
        })
      );

      const updateServices = productService.filter(
        (ps, id) => ps.packageServices.length > 0
      );

      const finalProductData = {
        basic: updatedProductBase,
        options: productOption,
        variants: updatedVariants,
        services: updateServices,
        attributes: productAttribute,
      };

      const fetchProductAdd = async () => {
        const response = await productServiceApi.createProduct(
          finalProductData
        );
        if (response.data && response.data.data) {
          console.log("work");
        } else {
          setError(response.data.message || "Không có dữ liệu option.");
        }
        setLoading(false);
      };

      console.log(finalProductData);

      fetchProductAdd();
    } catch (error) {
      console.error("Lỗi trong quá trình submit:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
      </div>
      <button type="submit">Gửi</button>
      <button type="button">Clear</button>
    </form>
  );
}

export default ProductSection;
