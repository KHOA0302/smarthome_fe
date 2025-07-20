import { useEffect, useState } from "react";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
} from "../../../icons";
import styles from "./AttributeInfo.module.scss";
import classNames from "classnames/bind";
import { attributeService } from "../../../api/attributeService";

const cx = classNames.bind(styles);

function AttributeInfo({
  productAttribute,
  setProductAttribute,
  productCategory,
}) {
  const [groupFilter, setGroupFilter] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expendGroups, setExpendGroups] = useState([]);

  useEffect(() => {
    const fetchAttributeByCategory = async () => {
      try {
        const response = await attributeService.getAttributeByCategory(
          productCategory
        );

        if (response.data && response.data.data) {
          setGroupFilter(response.data.data);
        } else {
          setError(response.data.message || "Không có dữ liệu brands.");
        }
        setLoading(false);
      } catch (err) {
        console.error("Lỗi khi fetch brands:", err);

        setError(err.message || "Đã xảy ra lỗi khi tải thương hiệu.");
        setLoading(false);
      }
    };
    if (productCategory != "") {
      fetchAttributeByCategory();
    }
  }, [productCategory]);

  useEffect(() => {
    const groups = groupFilter.map((group, id) => {
      const newAttribute = group.attributes.map((attr, i) => {
        return {
          ...attr,
          specifications: [
            { attributeId: attr.attribute_id, attributeValue: "" },
          ],
          isRemove: false,
        };
      });
      const newGroup = {
        ...group,
        attributes: [...newAttribute],
        isRemove: false,
      };

      return newGroup;
    });

    setProductAttribute(groups);
  }, [groupFilter]);

  const handleGroupExpand = (groupId) => {
    let newExpendGroup;
    if (expendGroups.includes(groupId)) {
      newExpendGroup = expendGroups.filter((expG, i) => expG !== groupId);
    } else {
      newExpendGroup = [...expendGroups, groupId];
    }
    setExpendGroups([...newExpendGroup]);
  };

  const handleGroupRemove = (mapId) => {
    const newGroups = [...productAttribute];
    newGroups[mapId].isRemove = !productAttribute[mapId].isRemove;
    setProductAttribute([...newGroups]);
  };

  const handleAttributeRemove = (groupId, attrMapId) => {
    const newGroups = productAttribute.map((pa, id) => {
      if (pa.group_id === groupId) {
        const newAttributes = [...pa.attributes];
        newAttributes[attrMapId].isRemove = !pa.attributes[attrMapId].isRemove;

        return {
          ...pa,
          attributes: newAttributes,
        };
      }

      return pa;
    });

    setProductAttribute([...newGroups]);
  };

  const handleAddSpecificationInput = (groupId, attrMapId) => {
    const newGroups = productAttribute.map((pa, id) => {
      if (pa.group_id === groupId) {
        const newAttributes = [...pa.attributes];
        const newSpecifications = [
          ...newAttributes[attrMapId].specifications,
          {
            attributeId: newAttributes[attrMapId].attribute_id,
            attributeValue: "",
          },
        ];

        newAttributes[attrMapId].specifications = [...newSpecifications];

        return {
          ...pa,
          attributes: newAttributes,
        };
      }
      return pa;
    });

    setProductAttribute([...newGroups]);
  };

  const handleRemoveSpecificationInput = (groupId, attrMapId) => {
    const newGroups = productAttribute.map((pa, id) => {
      if (pa.group_id === groupId) {
        const newAttributes = [...pa.attributes];
        const newSpecifications = [...newAttributes[attrMapId].specifications];
        const firstEmptyIndex = newSpecifications.findIndex(
          (spe) => spe.attributeValue === ""
        );

        if (newSpecifications.length > 1 && firstEmptyIndex !== -1) {
          newSpecifications.splice(firstEmptyIndex, 1);
        }

        newAttributes[attrMapId].specifications = [...newSpecifications];
        return {
          ...pa,
          attributes: newAttributes,
        };
      }
      return pa;
    });
    setProductAttribute([...newGroups]);
  };

  const handleChangeSpecValue = (e, groupId, attrMapId, specMapId) => {
    const newGroups = productAttribute.map((pa, id) => {
      if (pa.group_id === groupId) {
        const newAttributes = [...pa.attributes];
        const newSpecifications = [...newAttributes[attrMapId].specifications];
        newSpecifications[specMapId].attributeValue = e.target.value;
        newAttributes[attrMapId].specifications = newSpecifications;

        return {
          ...pa,
          attributes: [...newAttributes],
        };
      }
      return pa;
    });

    setProductAttribute([...newGroups]);
  };

  const groupsHtml = productAttribute.map((pa, id) => {
    return (
      <div className={cx("attribute-group")} key={id}>
        <div className={cx("attribute-group-container")}>
          <div className={cx({ remove: pa.isRemove })}>
            <span>Tên GROUP</span>
            <h4>{pa.group_name}</h4>
            <button
              className={cx("expand-btn")}
              type="button"
              onClick={() => handleGroupExpand(pa.group_id)}
            >
              <ArrowDownIcon />
            </button>
          </div>
          <button
            className={cx("attribute-group-remove_btn")}
            type="button"
            onClick={() => handleGroupRemove(id)}
          >
            <TrashIcon />
          </button>
        </div>
        <div
          className={cx("attribute-value", {
            expend: expendGroups.includes(pa.group_id),
          })}
        >
          {pa.attributes.map((attr, i) => {
            return (
              <div className={cx("attribute-value-container")} key={i}>
                <ArrowRightIcon />
                <div
                  className={cx("attribute-value-container_blank", {
                    remove: attr.isRemove,
                  })}
                >
                  <div className={cx("attribute-value-container_wrapper")}>
                    <div>
                      <span>{attr.attribute_name}</span>
                    </div>

                    <div>
                      {attr.specifications.map((specification, speId) => {
                        return (
                          <input
                            key={speId}
                            type="text"
                            id={"attribute-value-" + i + "-" + id + "-" + speId}
                            placeholder="Nhập thông số..."
                            onChange={(e) =>
                              handleChangeSpecValue(e, pa.group_id, i, speId)
                            }
                            value={specification.attributeValue}
                            required={!pa.isRemove && !attr.isRemove}
                          />
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() =>
                        handleAddSpecificationInput(pa.group_id, i)
                      }
                    >
                      <PlusIcon />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveSpecificationInput(pa.group_id, i)
                      }
                    >
                      <MinusIcon />
                    </button>
                  </div>
                </div>
                <button
                  className={cx("attribute-value-remove_btn")}
                  type="button"
                  onClick={() => handleAttributeRemove(pa.group_id, i)}
                >
                  <TrashIcon />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  });

  return (
    <section className={cx("attribute-section")}>
      <div className={cx("attribute-wrapper")}>
        <h1>Thông số kĩ thuật</h1>
        <div className={cx("attribute-container")}>
          {/* <div className={cx("attribute-group")}>
            <div className={cx("attribute-group-container")}>
              <div>
                <span>Tên GROUP </span>
                <h4>Công nghệ màn hình</h4>
                <button className={cx("expand-btn")} type="button">
                  <ArrowDownIcon />
                </button>
              </div>
              <button
                className={cx("attribute-group-remove_btn")}
                type="button"
              >
                <TrashIcon />
              </button>
            </div>
            <div className={cx("attribute-value")}>
              <div className={cx("attribute-value-container")}>
                <ArrowRightIcon />
                <div className={cx("attribute-value-container_blank")}>
                  <div className={cx("attribute-value-container_wrapper")}>
                    <div>
                      <select id="attribute">
                        <option value="">--Chọn thông số---</option>
                      </select>
                    </div>
                    <div>
                      <input
                        type="text"
                        id="attribute-value"
                        placeholder="Nhập thông số..."
                        required
                      />
                      <input
                        type="text"
                        id="attribute-value"
                        placeholder="Nhập thông số..."
                        required
                      />
                      <input
                        type="text"
                        id="attribute-value"
                        placeholder="Nhập thông số..."
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <button type="button">
                      <PlusIcon />
                    </button>
                    <button type="button">
                      <MinusIcon />
                    </button>
                  </div>
                </div>
                <button
                  className={cx("attribute-value-remove_btn")}
                  type="button"
                >
                  <TrashIcon />
                </button>
              </div>

              <button type="button">Thêm thông số</button>
            </div>
          </div> */}

          {groupsHtml}
        </div>
      </div>
    </section>
  );
}

export default AttributeInfo;
