import { useEffect, useState } from "react";
import { DotIcon, TrashIcon, TrexIcon } from "../../../icons";
import styles from "./VariantInfo.module.scss";
import classNames from "classnames/bind";
import { optionService } from "../../../api/optionService";
import { v4 as uuidv4 } from "uuid";
import { formatNumber } from "../../../utils/formatNumber";

const cx = classNames.bind(styles);

function VariantInfo({
  productOption,
  setProductOption,
  productVariant,
  setProductVariant,
  productName,
  productCategory,
}) {
  const [isHover, setIsHover] = useState("");
  const [optionFilters, setOptionFilters] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOptionFilter = async () => {
      try {
        const response = await optionService.getOptionFilter(productCategory);
        if (response.data && response.data.data) {
          setOptionFilters(response.data.data);
        } else {
          setError(response.data.message || "Không có dữ liệu option.");
        }
        setLoading(false);
      } catch (err) {
        console.error("Lỗi khi fetch option:", err);

        setError(err.message || "Đã xảy ra lỗi khi tải các lựa chọn.");
        setLoading(false);
      }
    };

    if (productCategory !== "") {
      fetchOptionFilter();
    }
  }, [productCategory]);

  //generate variant from option
  useEffect(() => {
    const variants = optionValueGeneratedCombinations.map((combination, id) => {
      const uniqueSuffix = `${uuidv4().substring(0, 8)}-${Date.now()
        .toString()
        .slice(-6)}`;
      return {
        optionNames,
        combination,
        variantName: productName + combination.join(" "),
        sku: productName + "_" + combination.join("_") + "-" + uniqueSuffix,
        price: "",
        quantity: "",
        img: "",
        isRemove: false,
      };
    });

    setProductVariant([...variants]);
  }, [productOption]);

  const handleAddOptionForm = (e) => {
    setProductOption([
      ...productOption,
      {
        optionId: "",
        optionValue: [""],
      },
    ]);
  };

  const handleDeleteOptionForm = (id) => {
    setProductOption(productOption.filter((_, index) => index !== id));
  };

  const handleAddOptionValueForm = (e, id) => {
    const newProductVariant = productOption.map((option, index) => {
      if (index === id) {
        return {
          ...option,
          optionValue: [...option.optionValue, e.target.value],
        };
      }
      return option;
    });

    setProductOption([...newProductVariant]);
  };

  const handleDeleteOptionValueForm = (id, mapOptionId) => {
    const newProductVariant = productOption.map((option, index) => {
      if (index === mapOptionId) {
        return {
          ...option,
          optionValue: option.optionValue.filter(
            (_, valueId) => id !== valueId
          ),
        };
      }
      return option;
    });

    setProductOption([...newProductVariant]);
  };

  const handleInputOptionValueChange = (e, id, mapOptionId) => {
    const newProductOption = productOption.map((option, index) => {
      if (index === mapOptionId) {
        const newOptionValues = [...option.optionValue];
        newOptionValues[id] = e.target.value;

        return {
          ...option,
          optionValue: newOptionValues,
        };
      }
      return option;
    });

    setProductOption(newProductOption);
  };

  const handleOptionVariantChange = (e, id) => {
    const newProductVariant = productOption.map((option, index) => {
      if (index === id) {
        return { ...option, optionId: e.target.value };
      }
      return option;
    });

    setProductOption([...newProductVariant]);
  };

  const generateVariants = (arrays) => {
    if (!arrays || arrays.length === 0) {
      return [];
    }

    return arrays.reduce(
      (accumulator, currentArray) => {
        if (currentArray.length === 0) {
          return [];
        }

        return accumulator.flatMap((existingCombination) => {
          return currentArray.map((newItem) => [
            ...existingCombination,
            newItem,
          ]);
        });
      },
      [[]]
    );
  };

  const optionValueGeneratedCombinations = generateVariants(
    productOption.map((pv) => pv.optionValue)
  );

  const optionNames = productOption.map((option) => {
    return optionFilters.filter(
      (of) => of.option_id + "" === option.optionId
    )[0]?.option_name;
  });

  const handleSetProductVariant = (e, variantId) => {
    let newProductVariant;
    switch (e.target.name) {
      case "name":
        newProductVariant = productVariant.map((pv, id) => {
          if (id === variantId) {
            return {
              ...pv,
              variantName: e.target.value,
            };
          }
          return pv;
        });

        setProductVariant([...newProductVariant]);
        break;
      case "price":
        newProductVariant = productVariant.map((pv, id) => {
          if (id === variantId) {
            const priceNumber = e.target.value.replace(/\D/g, "");
            const formattedValue = new Intl.NumberFormat("vi-VN").format(
              parseInt(priceNumber, 10)
            );

            return {
              ...pv,
              price: formatNumber(e.target.value),
            };
          }
          return pv;
        });

        setProductVariant([...newProductVariant]);
        break;
      case "quantity":
        newProductVariant = productVariant.map((pv, id) => {
          if (id === variantId) {
            return {
              ...pv,
              quantity: e.target.value,
            };
          }
          return pv;
        });

        setProductVariant([...newProductVariant]);
        break;
      case "img":
        newProductVariant = productVariant.map((pv, id) => {
          if (id === variantId) {
            return {
              ...pv,
              img: e.target.files[0],
            };
          }
          return pv;
        });

        setProductVariant([...newProductVariant]);
        break;
      default:
    }
  };

  const handleVariantRemove = (variantId) => {
    const newProductVariant = productVariant.map((variant, id) => {
      if (id === variantId) {
        return {
          ...variant,
          isRemove: !variant.isRemove,
        };
      }
      return variant;
    });

    setProductVariant([...newProductVariant]);
  };

  const options = productOption.map((option, id) => {
    const mapOptionId = id;
    return (
      <div className={cx("option-column")} key={id}>
        <div className={cx("option-row_1")}>
          <label htmlFor="optional">Tùy chọn loại</label>
          <select
            id="optional"
            name="id"
            value={option.optionId}
            required
            onChange={(e) => handleOptionVariantChange(e, id)}
          >
            <option value="">--Chọn tùy chọn--</option>
            {optionFilters.map((optional, id) => {
              return (
                <option value={optional.option_id} key={id}>
                  {optional.option_name}
                </option>
              );
            })}
          </select>
        </div>
        <div className={cx("option-row_2")}>
          <span htmlFor="">Giá trị tùy chọn</span>
          <div className={cx("option-row_element")}>
            {option.optionValue.map((value, id) => {
              return (
                <div key={id}>
                  <input
                    type="text"
                    name="option_value"
                    required
                    value={value}
                    onChange={(e) =>
                      handleInputOptionValueChange(e, id, mapOptionId)
                    }
                  />
                  {option.optionValue.length > 1 ? (
                    <TrashIcon
                      onClick={() =>
                        handleDeleteOptionValueForm(id, mapOptionId)
                      }
                    />
                  ) : (
                    <TrexIcon />
                  )}
                </div>
              );
            })}
            <button
              type="button"
              onClick={(e) => handleAddOptionValueForm(e, id)}
              style={{
                backgroundColor: "darkblue",
                color: "white",
                border: "none",
                padding: "2px 4px",
                borderRadius: "4px",
                fontWeight: "700",
              }}
            >
              Thêm giá trị
            </button>
          </div>
        </div>
        {productOption.length > 1 ? (
          <button
            type="button"
            className={cx("option-column_remove")}
            onClick={(e) => handleDeleteOptionForm(id)}
          >
            <TrashIcon />
          </button>
        ) : (
          <button type="button" className={cx("option-column_remove")}>
            <TrexIcon />
          </button>
        )}
      </div>
    );
  });

  return (
    <section className={cx("variant-section")}>
      <h1>Quản lý các biến thể</h1>
      <div className={cx("variant-container")}>
        <div className={cx("variant-container_1")}>
          <h3>1. Định nghĩa các tùy chọn</h3>
          {options}
          <button
            type="button"
            onClick={handleAddOptionForm}
            style={{
              backgroundColor: "darkOrange",
              color: "white",
              border: "none",
              padding: "4px 6px",
              borderRadius: "4px",
              fontWeight: "800",
            }}
          >
            Thêm tùy chọn
          </button>
        </div>
        <div className={cx("variant-container_2")}>
          {optionNames.some((name) => name !== "" && name !== undefined) && (
            <>
              <h3>2. Các biến thể sản phẩm</h3>
              <div className={cx("variant-table")}>
                <table>
                  <thead>
                    <tr>
                      {optionNames.map((name, id) => {
                        return (
                          <th className={cx("option-name")} key={id}>
                            <span>{name}</span>
                          </th>
                        );
                      })}
                      <th className={cx("typical", "extra-width")}>
                        <span>Tên</span>
                      </th>
                      <th className={cx("typical")}>
                        <span>Giá</span>
                      </th>
                      <th className={cx("typical")}>
                        <span>SL</span>
                      </th>
                      <th className={cx("typical")}>
                        <span>Ảnh</span>
                      </th>
                      <th className={cx("typical")}></th>
                    </tr>
                  </thead>

                  <tbody>
                    {productVariant.map((variant, id) => {
                      return (
                        <tr
                          key={id}
                          className={cx({
                            hoverActive: isHover === id,
                            remove: variant.isRemove,
                          })}
                        >
                          {variant.combination.map((value, id) => {
                            return (
                              <th key={id} className={cx("option-value")}>
                                <span>{value}</span>
                              </th>
                            );
                          })}
                          <td className={cx("value")}>
                            <input
                              required={!variant.isRemove}
                              name="name"
                              type="text"
                              value={variant.variantName}
                              onChange={(e) => handleSetProductVariant(e, id)}
                            />
                          </td>
                          <td className={cx("value")}>
                            <input
                              required={!variant.isRemove}
                              name="price"
                              type="text"
                              value={variant.price}
                              onChange={(e) => handleSetProductVariant(e, id)}
                            />
                          </td>
                          <td className={cx("value")}>
                            <input
                              required={!variant.isRemove}
                              name="quantity"
                              type="number"
                              value={variant.quantity}
                              onChange={(e) => handleSetProductVariant(e, id)}
                            />
                          </td>
                          <td className={cx("value")}>
                            <input
                              required={!variant.isRemove}
                              name="img"
                              type="file"
                              onChange={(e) => handleSetProductVariant(e, id)}
                            />
                          </td>
                          <td>
                            <button
                              type="button"
                              className={cx("variant-btn_remove")}
                              onMouseEnter={() => setIsHover(id)}
                              onMouseLeave={() => setIsHover("")}
                              onClick={() => handleVariantRemove(id)}
                            >
                              <TrashIcon />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default VariantInfo;
