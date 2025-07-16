import { useState } from "react";
import { TrashIcon } from "../../icons";
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
import { v4 as uuidv4 } from "uuid";

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

  const [productAttribute, setProductAttribute] = useState([
    {
      groupId: 0,
      groupAttribute: [
        {
          attributeId: 0,
          attributeValue: "",
        },
      ],
    },
  ]);

  const validationProductDetail = () => {
    let approve = false;
    return approve;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Để có một identifier duy nhất trước khi có product_id từ backend,
      // bạn có thể dùng một UUID hoặc timestamp, hoặc tên sản phẩm đã chuẩn hóa.
      // Nếu bạn muốn nhóm ảnh theo tên sản phẩm, hãy đảm bảo tên là duy nhất
      // hoặc thêm một timestamp/UUID vào sau tên để đảm bảo thư mục là duy nhất
      const productIdentifier =
        productBase.name.replace(/\s+/g, "_").toLowerCase() ||
        `new_product_${Date.now()}`;

      // 1. Upload ảnh base lên Firebase Storage
      const baseImageUrls = await uploadMultipleImagesToFirebase(
        productBase.imgs,
        "basic", // <--- LOẠI ẢNH: 'basic'
        productIdentifier // <--- IDENTIFIER
      );

      const updatedProductBase = {
        ...productBase,
        imgs: baseImageUrls,
      };

      const updatedVariants = await Promise.all(
        productVariant.map(async (variant) => {
          if (!variant.isRemove) {
            if (variant.img && variant.img instanceof File) {
              // <-- KIỂM TRA TẠI ĐÂY
              // Nếu variant.img là một File object (nghĩa là người dùng đã chọn ảnh)
              const variantIdentifier =
                variant.sku ||
                `${productIdentifier}_${variant.combination.join("-")}`;
              const variantImageUrl = await uploadImageToFirebase(
                variant.img, // <-- Sử dụng variant.img (đang chứa File object)
                "variant",
                variantIdentifier
              );
              // Trả về biến thể với URL ảnh đã cập nhật, thay thế File object
              return { ...variant, img: variantImageUrl };
            }
            // Nếu không có file ảnh hoặc img đã là URL (ví dụ: đang chỉnh sửa sản phẩm đã có)
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

      // *** LƯU Ý VỚI ẢNH VARIANT ***
      // Nếu mỗi variant có ảnh riêng (như giao diện bạn đã đưa, có nút "Choose File" cho ảnh biến thể)
      // bạn sẽ cần một cách để thu thập các files cho từng biến thể và upload chúng riêng biệt.
      // Ví dụ:
      // 1. Trong VariantInfo, bạn sẽ cần một state riêng cho files ảnh của mỗi variant.
      // 2. Khi files ảnh của một variant được chọn, VariantInfo sẽ gọi một prop callback
      //    để truyền files đó lên ProductSection hoặc quản lý nó nội bộ.
      // 3. Trước khi submit, bạn sẽ lặp qua productVariant state. Đối với mỗi variant có files ảnh,
      //    bạn sẽ gọi uploadMultipleImagesToFirebase(variantFiles, 'variant', variant.sku || productIdentifier + '_' + index)
      //    để upload ảnh và cập nhật URL vào variant đó.

      // Ví dụ giả định cho ảnh variant (nếu bạn có logic upload cho từng variant):
      // const updatedVariants = await Promise.all(productVariant.map(async (variant) => {
      //   if (variant.selectedImageFiles && variant.selectedImageFiles.length > 0) { // Giả sử có trường selectedImageFiles
      //     const variantIdentifier = variant.sku || `${productIdentifier}_${variant.id}`; // Dùng SKU nếu có
      //     const variantImageUrls = await uploadMultipleImagesToFirebase(
      //       variant.selectedImageFiles,
      //       'variant',
      //       variantIdentifier
      //     );
      //     return { ...variant, img: variantImageUrls[0] || null }; // Giả sử mỗi variant chỉ có 1 ảnh
      //   }
      //   return variant;
      // }));
      // finalProductData.variants = updatedVariants;

      // 4. Gửi dữ liệu về Backend
      // ... (phần gửi fetch/axios request) ...
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

        <section className={cx("attribute-section")}></section>
      </div>
      <button type="submit">Gửi</button>
      <button type="button">Clear</button>
    </form>
  );
}

export default ProductSection;
