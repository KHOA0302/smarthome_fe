import { useRef, useState } from "react";
import styles from "./VariantEdit.module.scss";
import classNames from "classnames/bind";
import { TrashIcon } from "../../icons";
import { formatNumber } from "../../utils/formatNumber";
import productService from "../../api/productService";
import { useParams } from "react-router";
import { uploadImageToFirebase } from "../../utils/firebaseUpload";
const cx = classNames.bind(styles);
function VariantEdit({ variants, dispatch }) {
  const [changeable, setChangeable] = useState(false);
  const fileInputRefs = useRef([]);
  const { productId } = useParams();

  const handleDispatch = (type, payload) => {
    dispatch({ type: type, payload: payload });
  };

  const handleAddImageClick = (index) => {
    fileInputRefs.current[index].click();
  };

  const handleFileChange = (e, variantIdChangeImg) => {
    const file = e.target.files[0];

    const tempImageUrl = URL.createObjectURL(file);
    dispatch({
      type: "CHANGE_VARIANT_TEMP_IMG",
      payload: {
        variantIdChangeImg,
        imageUrlVariant: tempImageUrl,
        fileVariant: file,
      },
    });
  };

  const fetch = async (e) => {
    e.preventDefault();

    const updateVariants = await Promise.all(
      variants.map(async (variant) => {
        if (variant.file) {
          const imgUrlFirebase = await uploadImageToFirebase(
            variant.file,
            "variant"
          );
          return {
            ...variant,
            image_url: imgUrlFirebase,
          };
        }
        return variant;
      })
    );

    try {
      const res = productService.editVariants(productId, updateVariants);
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form className="wrapper" onSubmit={fetch}>
      <div className={cx("container")}>
        <h3>Phần biến thể sản phẩm</h3>
        <div className={cx("blank")}>
          <button onClick={() => setChangeable(!changeable)} type="button">
            SỬA
          </button>
          <table>
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tên</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {variants.map((variant, id) => {
                return (
                  <tr key={id} className={cx({ remove: variant.isRemove })}>
                    <td>
                      <div
                        className={cx("variant-img", { active: changeable })}
                      >
                        <img src={variant.image_url} />
                        {changeable && (
                          <div>
                            <button
                              onClick={() => handleAddImageClick(id)}
                              type="button"
                            >
                              ĐỔI ẢNH
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      {changeable ? (
                        <input
                          value={variant.variant_name}
                          name={`name_${id}`}
                          type="text"
                          onChange={(e) =>
                            handleDispatch("EDIT_VARIANT_NAME", {
                              editNameVariantId: variant.variant_id,
                              variantName: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <span>{variant.variant_name}</span>
                      )}
                    </td>
                    <td>
                      {changeable ? (
                        <input
                          value={formatNumber(variant.price)}
                          name={`price_${id}`}
                          type="text"
                          onChange={(e) =>
                            handleDispatch("EDIT_VARIANT_PRICE", {
                              editPriceVariantId: variant.variant_id,
                              variantPrice: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <span>{formatNumber(parseInt(variant.price))}đ</span>
                      )}
                    </td>
                    <td>
                      {changeable ? (
                        <input
                          value={variant.stock_quantity}
                          name={`quantity_${id}`}
                          type="number"
                          onChange={(e) =>
                            handleDispatch("EDIT_VARIANT_QUANTITY", {
                              editQuantityVariantId: variant.variant_id,
                              variantQuantity: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <span>{variant.stock_quantity} </span>
                      )}
                    </td>
                    <td>
                      {changeable &&
                        (variant.exist_in_order ? (
                          <button
                            className={cx("variant-remove", {
                              ["exist-in-order"]: variant.exist_in_order,
                            })}
                            type="button"
                          >
                            <TrashIcon />
                          </button>
                        ) : (
                          <button
                            className={cx("variant-remove")}
                            onClick={() =>
                              handleDispatch(
                                "DELETE_VARIANT",
                                variant.variant_id
                              )
                            }
                            type="button"
                          >
                            <TrashIcon />
                          </button>
                        ))}
                      <input
                        type="file"
                        hidden
                        ref={(el) => (fileInputRefs.current[id] = el)}
                        onChange={(e) =>
                          handleFileChange(e, variant.variant_id)
                        }
                        accept="image/*"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {changeable && <button type="submit">SUBMIT</button>}
      </div>
    </form>
  );
}

export default VariantEdit;
