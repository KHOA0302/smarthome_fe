import { useEffect, useState } from "react";
import styles from "./SpecificationEdit.module.scss";
import classNames from "classnames/bind";
import { attributeService } from "../../api/attributeService";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  MinusIcon,
  PlusIcon,
} from "../../icons";
import productService from "../../api/productService";
import { useParams } from "react-router";
import { toast, ToastContainer } from "react-toastify";
const cx = classNames.bind(styles);
function SpecificationEdit({ attributeGroups, dispatch }) {
  const [expend, setExpend] = useState([]);
  const [changeable, setChangeable] = useState(false);
  const { productId } = useParams();
  const handleExpend = (id) => {
    if (expend.includes(id)) {
      const newExpend = expend.filter((e) => e != id);
      setExpend([...newExpend]);
    } else {
      setExpend((prev) => [...prev, id]);
    }
  };

  const handleDispatch = (type, payload) => {
    dispatch({ type: type, payload: payload });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await toast.promise(
        productService.editSpecifications(productId, attributeGroups),
        {
          pending: "Đang cập nhật thông số kỹ thuật...",
          success: "Cập nhật thành công! 🎉",
          error: "Cập nhật thất bại! 😔",
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form className={cx("wrapper")} onSubmit={handleSubmit}>
      <div className={cx("container")}>
        <div className={cx("title")}>
          <h3>Phần thông số kĩ thuật</h3>
          <button
            type="button"
            onClick={() => setChangeable(!changeable)}
            className={cx({ active: changeable })}
          >
            SỬA
          </button>
        </div>
        <div className={cx("blank")}>
          <div className={cx("groups")}>
            {attributeGroups.map((group, id) => {
              return (
                <div className={cx("groups-wrapper")} key={id}>
                  <div
                    className={cx("group", {
                      expend: expend.includes(group.groupId),
                    })}
                    onClick={() => handleExpend(group.groupId)}
                  >
                    <span>{group.groupName}</span>
                    <button type="button">
                      <ArrowDownIcon />
                    </button>
                  </div>
                  <div
                    className={cx("group-items", {
                      expend: expend.includes(group.groupId),
                    })}
                  >
                    {group.attributes.map((attribute, i) => {
                      return (
                        <div className={cx("group-item")} key={i}>
                          <ArrowRightIcon />
                          <div className={cx("group-item-wrapper")}>
                            <div className={cx("group-item-main")}>
                              <span>{attribute.attributeName}</span>
                              <ul>
                                {attribute.attributeValues.map(
                                  (value, idMapValue) => {
                                    return (
                                      <li
                                        key={idMapValue}
                                        className={cx({
                                          remove: value.isRemove,
                                        })}
                                      >
                                        {changeable ? (
                                          <div>
                                            <input
                                              value={value.attributeValueName}
                                              name="specification"
                                              placeholder="Nhập gí trị thông số..."
                                              onChange={(e) =>
                                                handleDispatch(
                                                  "CHANGE_VALUE_SPECIFICATION",
                                                  {
                                                    changeValueGroupId:
                                                      group.groupId,
                                                    changeValueAttributeId:
                                                      attribute.attributeId,
                                                    changeValueItemId:
                                                      value.attributeValueId,
                                                    changeValue: e.target.value,
                                                  }
                                                )
                                              }
                                            />
                                            <button
                                              type="button"
                                              onClick={() => {
                                                return (
                                                  changeable &&
                                                  handleDispatch(
                                                    "DELETE_SPECIFICATION",
                                                    {
                                                      deleteSpecGroupId:
                                                        group.groupId,
                                                      deleteSpecAttributeId:
                                                        attribute.attributeId,
                                                      deleteSpecValueId:
                                                        value.attributeValueId,
                                                    }
                                                  )
                                                );
                                              }}
                                            >
                                              <MinusIcon />
                                            </button>
                                          </div>
                                        ) : (
                                          <span>
                                            {value.attributeValueName}
                                          </span>
                                        )}
                                      </li>
                                    );
                                  }
                                )}
                              </ul>
                            </div>
                            <div className={cx("group-item-change-btn")}>
                              <button
                                type="button"
                                onClick={() => {
                                  return (
                                    changeable &&
                                    handleDispatch("ADD_SPECIFICATION", {
                                      addSpecGroupId: group.groupId,
                                      addSpecAttributeId: attribute.attributeId,
                                    })
                                  );
                                }}
                              >
                                <PlusIcon />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {changeable && (
          <button type="submit" className={cx("submit-btn")}>
            SUBMIT
          </button>
        )}
      </div>

      <ToastContainer />
    </form>
  );
}

export default SpecificationEdit;
