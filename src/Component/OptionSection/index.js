import { useEffect, useState } from "react";
import styles from "./OptionSection.module.scss";
import classNames from "classnames/bind";
import { useProductInfoFormGetContext } from "../../Pages/Admin/ProductAdd";
import { optionService } from "../../api/optionService";
import { FilterIcon, FilterOffIcon } from "../../icons";
const cx = classNames.bind(styles);
function OptionSection() {
  const { categories } = useProductInfoFormGetContext();
  const [optionsModified, setOptionsModified] = useState([]);
  const [currentCate, setCurrentCate] = useState("");
  const [optionValue, setOptionValue] = useState({ name: "", isFilter: true });

  useEffect(() => {
    const fetchOptionFilter = async () => {
      try {
        const res = await optionService.getOptionFilter(currentCate);
        setOptionsModified([...res.data.data]);
      } catch (error) {}
    };
    if (!!currentCate) {
      fetchOptionFilter();
    }
  }, [currentCate]);

  const fetchCreateOption = async () => {
    try {
      const res = await optionService.createOption(currentCate, optionValue);
      setOptionValue({ name: "", isFilter: true });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={fetchCreateOption}>
      <div className={cx("wrapper")}>
        <div className={cx("container")}>
          <div className={cx("option-new")}>
            <input
              value={optionValue.name}
              onChange={(e) =>
                setOptionValue({
                  ...optionValue,
                  name: e.target.value,
                })
              }
              placeholder="Vui lòng nhập option...."
              name="option-value"
              required
            />
            <button
              type="button"
              className={cx({ active: optionValue.isFilter })}
              onClick={() =>
                setOptionValue({
                  ...optionValue,
                  isFilter: !optionValue.isFilter,
                })
              }
            >
              {optionValue.isFilter ? <FilterIcon /> : <FilterOffIcon />}
            </button>
          </div>
          <div className={cx("category-option_exist")}>
            <div className={cx("category")}>
              <select
                onChange={(e) => setCurrentCate(e.target.value)}
                value={currentCate}
                name="category"
                id="category"
                required
              >
                <option value="">--Vui lòng chọn danh mục--</option>
                {categories.map((category, id) => {
                  return (
                    <option id={id} key={id} value={category.category_id}>
                      {category.category_name}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className={cx("option-exist")}>
              <ul>
                {optionsModified.map((optionModified, id) => {
                  return <li key={id}>{optionModified.option_name}</li>;
                })}
              </ul>
            </div>
          </div>
          <button type="submit" className={cx("submit")}>
            Gửi
          </button>
        </div>
      </div>
    </form>
  );
}

export default OptionSection;
