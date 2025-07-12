import { DotIcon, TrashIcon, TrexIcon } from "../../../icons";
import styles from "./VariantInfo.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const optionals = [
  { id: 1, name: "Dung tích" },
  { id: 2, name: "Số lượng ngăn" },
  { id: 3, name: "Vị trí ngăn" },
];

function VariantInfo({ productVariant, setProductVariant, productName }) {
  const handleAddOptionForm = (e) => {
    setProductVariant([
      ...productVariant,
      {
        optionId: "",
        optionValue: [""],
      },
    ]);
  };

  const handleDeleteOptionForm = (id) => {
    setProductVariant(productVariant.filter((_, index) => index !== id));
  };

  const handleAddOptionValueForm = (e, id) => {
    const newProductVariant = productVariant.map((option, index) => {
      if (index === id) {
        return {
          ...option,
          optionValue: [...option.optionValue, e.target.value],
        };
      }
      return option;
    });

    setProductVariant([...newProductVariant]);
  };

  const handleDeleteOptionValueForm = (id, mapOptionId) => {
    const newProductVariant = productVariant.map((option, index) => {
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

    setProductVariant([...newProductVariant]);
  };

  const handleInputOptionValueChange = (e, id, mapOptionId) => {
    const newProductVariant = productVariant.map((option, index) => {
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

    setProductVariant(newProductVariant);
  };

  const handleOptionVariantChange = (e, id) => {
    const newProductVariant = productVariant.map((option, index) => {
      if (index === id) {
        return { ...option, optionId: e.target.value };
      }
      return option;
    });

    setProductVariant([...newProductVariant]);
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
    productVariant.map((pv) => pv.optionValue)
  );

  const optionNames = productVariant
    .map((option) => {
      return optionals.filter(
        (optional) => optional.id + "" === option.optionId
      )[0]?.name;
    })
    .filter((o) => o !== undefined);

  const options = productVariant.map((option, id) => {
    const mapOptionId = id;
    return (
      <div className={cx("option-column")} key={id}>
        <div className={cx("option-row_1")}>
          <label htmlFor="optional">Tùy chọn loại</label>
          <select
            id="optional"
            name="id"
            value={option.optionId}
            onChange={(e) => handleOptionVariantChange(e, id)}
          >
            <option value="">--Chọn tùy chọn--</option>
            {optionals.map((optional, id) => {
              return (
                <option value={optional.id} key={id}>
                  {optional.name}
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
            >
              Thêm giá trị
            </button>
          </div>
        </div>
        {productVariant.length > 1 ? (
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
          <button type="button" onClick={handleAddOptionForm}>
            Thêm tùy chọn
          </button>
        </div>
        <div className={cx("variant-container_2")}>
          <h3>2. Các biến thể sản phẩm</h3>
          <div className={cx("variant-table")}>
            {optionNames.length > 0 && (
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
                    <th className={cx("typical")}>
                      <span>SKU</span>
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
                  {optionValueGeneratedCombinations.map((combination, id) => {
                    let sku = productName;
                    return (
                      <tr key={id}>
                        {combination.map((value, id) => {
                          sku += "_" + value;
                          return (
                            <th key={id} className={cx("option-value")}>
                              <span>{value}</span>
                            </th>
                          );
                        })}
                        <td className={cx("value")}>
                          <input type="text" value={sku} />
                        </td>
                        <td className={cx("value")}>
                          <input type="text" />
                        </td>
                        <td className={cx("value")}>
                          <input type="text" />
                        </td>
                        <td className={cx("value")}>
                          <input type="file" />
                        </td>
                        <td>
                          <button
                            type="button"
                            className={cx("variant-btn_remove")}
                          >
                            <TrashIcon />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default VariantInfo;
