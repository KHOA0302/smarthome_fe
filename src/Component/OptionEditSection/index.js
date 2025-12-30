import { useEffect, useState } from "react";
import { optionService } from "../../api/optionService";
import styles from "./OptionEditSection.module.scss";
import classNames from "classnames/bind";
import Tippy from "@tippyjs/react";
import { toast, ToastContainer } from "react-toastify";

const cx = classNames.bind(styles);
function OptionEditSection({ chosenCate }) {
  const [options, setOptions] = useState([]);
  const [submitOption, setSubmitOPtion] = useState({});

  const fetchOptions = async () => {
    try {
      const res = await optionService.getOptionFilter(chosenCate);
      setOptions(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, [chosenCate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const editPromise = optionService.editOption(submitOption);

    const customStyle = {
      position: "absolute",
      top: "0",
      right: "0",
    };

    toast
      .promise(editPromise, {
        pending: {
          render: () => "Đang xử lý...",
          style: customStyle,
        },
        success: {
          render: () => "Cập nhật thành công!",
          style: customStyle,
        },
        error: {
          render: ({ data }) => data?.message || "Lỗi rồi!",
          style: customStyle,
        },
      })
      .then((res) => {
        const { option_name, option_id } = res.data.data;
        const newOptions = options.map((option) => {
          if (option.option_id === option_id) {
            return {
              ...option,
              option_name: option_name,
            };
          }
          return option;
        });
        setOptions(newOptions);
      });
  };

  const handleChoseOption = (option) => {
    if (option.option_id === submitOption?.option_id) {
      setSubmitOPtion({ option_name: "" });
      return;
    }
    setSubmitOPtion({
      option_id: option.option_id,
      option_name: option.option_name,
    });
  };

  const handleChange = (e) => {
    if (!submitOption.option_id) return;
    setSubmitOPtion((prev) => ({
      ...prev,
      option_name: e.target.value,
    }));
  };

  return (
    <div className={cx("wrapper")}>
      <form onSubmit={handleSubmit} className={cx("form")}>
        <h4>Cập nhật lựa chọn: </h4>
        <div className={cx("input-box")}>
          <Tippy content="stt">
            <label htmlFor="option">#{submitOption?.option_id}</label>
          </Tippy>
          <input
            type="text"
            id="option"
            name="option"
            value={submitOption?.option_name}
            placeholder="Chọn 1 option"
            onChange={(e) => handleChange(e)}
            required
          />
        </div>
        <div className={cx("delete-save-btn")}>
          <button type="submit" className={cx("save")}>
            LƯU
          </button>
          <button type="button" className={cx("delete")}>
            XÓA
          </button>
        </div>
      </form>
      <div className={cx("container")}>
        {options.map((option, id) => {
          const category = option.category;
          return (
            <div
              key={id}
              className={cx("option-wrapper", {
                active: submitOption.option_id === option.option_id,
              })}
              onClick={() => handleChoseOption(option)}
            >
              <div
                className={cx("option-container", {
                  active: submitOption.option_id === option.option_id,
                })}
              >
                <span className={cx("id")}>#{option.option_id}</span>
                <span className={cx("option-name")}>{option.option_name}</span>
                <span className={cx("category-name")}>
                  {category.category_name}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <ToastContainer />
    </div>
  );
}

export default OptionEditSection;
