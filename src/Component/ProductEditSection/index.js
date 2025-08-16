import styles from "./ProductEditSection.module.scss";
import classNames from "classnames/bind";
import { useEffect, useReducer } from "react";

import { useParams } from "react-router";
import { initState, reducer } from "./reducer";

import ProductInfoEdit from "../ProductInfoEdit";
import ProductImgsEdit from "../ProductImgEdit";
import VariantEdit from "../VariantEdit";
import ServiceEdit from "../ServiceEdit";
import SpecificationEdit from "../SpecificationEdit";
import productService from "../../api/productService";

const cx = classNames.bind(styles);
function ProductEditSection() {
  const [state, dispatch] = useReducer(reducer, initState);
  const { productId } = useParams();

  useEffect(() => {
    const fetchProductDetails = async () => {
      dispatch({ type: "FETCH_START" });
      try {
        const res = await productService.getProductDetails(productId);
        if (res.status === 200) {
          dispatch({ type: "FETCH_SUCCESS", payload: res.data });
        }
      } catch (error) {
        dispatch({ type: "FETCH_ERROR", payload: error.message });
        console.error(error);
      }
    };
    fetchProductDetails();
  }, []);

  const {
    loading,
    error,
    productInfo,
    productImgs,
    variants,
    servicePackages,
    attributeGroups,
  } = state;

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <ProductInfoEdit
          productInfo={productInfo}
          dispatch={dispatch}
          loading={loading}
          error={error}
        />
        <ProductImgsEdit
          productImgs={productImgs}
          dispatch={dispatch}
          loading={loading}
          error={error}
        />
        <VariantEdit
          variants={variants}
          dispatch={dispatch}
          loading={loading}
          error={error}
        />
        <ServiceEdit
          category_id={productInfo.category_id}
          servicePackages={servicePackages}
          variants={variants}
          dispatch={dispatch}
          loading={loading}
          error={error}
        />
        <SpecificationEdit
          attributeGroups={attributeGroups}
          dispatch={dispatch}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
}

export default ProductEditSection;
