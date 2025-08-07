import styles from "./ProductEdit.module.scss";
import classNames from "classnames/bind";
import { useEffect, useReducer, useState } from "react";
import productService from "../../../api/productService";
import { useParams } from "react-router";
import { initState, reducer } from "./reducer";
import ProductInfoEdit from "../../../Component/ProductInfoEdit";
import ProductImgsEdit from "../../../Component/ProductImgEdit";
import VariantEdit from "../../../Component/VariantEdit";
import ServiceEdit from "../../../Component/ServiceEdit";
import SpecificationEdit from "../../../Component/SpecificationEdit";
const cx = classNames.bind(styles);
function ProductEdit() {
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
        <ProductInfoEdit productInfo={productInfo} dispatch={dispatch} />
        <ProductImgsEdit productImgs={productImgs} dispatch={dispatch} />
        <VariantEdit variants={variants} dispatch={dispatch} />
        <ServiceEdit
          category_id={productInfo.category_id}
          servicePackages={servicePackages}
          variants={variants}
          dispatch={dispatch}
        />
        <SpecificationEdit
          attributeGroups={attributeGroups}
          dispatch={dispatch}
        />
      </div>
    </div>
  );
}

export default ProductEdit;
