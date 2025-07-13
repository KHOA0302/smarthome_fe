import { useState } from "react";
import { TrashIcon } from "../../icons";
import styles from "./ProductSection.module.scss";
import classNames from "classnames/bind";
import VariantInfo from "./VariantInfo";
import BaseInfo from "./BaseInfo";
import ServiceInfo from "./ServiceInfo";

const cx = classNames.bind(styles);

function ProductSection() {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(123);
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
        />

        <section className={cx("attribute-section")}></section>
      </div>
      <button type="submit">Gửi</button>
      <button type="button">Clear</button>
    </form>
  );
}

export default ProductSection;
