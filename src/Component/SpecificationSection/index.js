import { useEffect, useState } from "react";
import styles from "./SpecificationSection.module.scss";
import classNames from "classnames/bind";
import { useProductInfoFormGetContext } from "../../Pages/Admin/ProductAdd";
import { attributeService } from "../../api/attributeService";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
} from "../../icons";

const cx = classNames.bind(styles);

function GroupsSpec({ groups, setGroups, specModified }) {
  const [expendGroups, setExpendGroups] = useState([]);
  const handleGroupExpand = (id) => {
    let newExpendGroup;
    if (expendGroups.includes(id)) {
      newExpendGroup = expendGroups.filter((expG) => expG !== id);
    } else {
      newExpendGroup = [...expendGroups, id];
    }
    setExpendGroups([...newExpendGroup]);
  };

  useEffect(() => {
    setExpendGroups([]);
  }, [specModified]);

  const handleAddGroup = () => {
    const newGroupValue = {
      groupName: "",
      displayOrder: groups[groups.length - 1]?.displayOrder + 100000,
      attributes: [
        { attributeName: "", displayOrder: 100000, isFilterable: 0 },
      ],
    };

    setGroups((prev) => [...prev, ...[newGroupValue]]);
  };

  const handleDelateGroup = (id) => {
    const newGroupsValue = groups.filter((_, i) => i !== id);

    if (groups.length > 1) {
      setGroups([...newGroupsValue]);
    }
  };

  const handleAddItem = (groupMapId) => {
    const newGroupsValue = groups.map((group, id) => {
      if (id === groupMapId) {
        const newAttribute = {
          attributeName: "",
          displayOrder:
            group.attributes[group.attributes.length - 1].displayOrder + 100000,
          isFilterable: 0,
        };
        return {
          ...group,
          attributes: [...group.attributes, newAttribute],
        };
      }
      return group;
    });

    setGroups([...newGroupsValue]);
  };

  const handleDelateItem = (groupMapId) => {
    const newGroupsValue = groups.map((group, id) => {
      if (id === groupMapId) {
        const newAttributes = [...group.attributes];
        const firstEmptyIndex = newAttributes.findIndex(
          (attr) => attr.attributeName === ""
        );
        if (newAttributes.length > 1 && firstEmptyIndex !== -1) {
          newAttributes.splice(firstEmptyIndex, 1);
        }

        return {
          ...group,
          attributes: [...newAttributes],
        };
      }
      return group;
    });

    setGroups([...newGroupsValue]);
  };

  console.log(groups);

  const handleGroupValueChange = (e, groupMapId) => {
    const newGroupsValue = groups.map((group, id) => {
      if (id === groupMapId) {
        return {
          ...group,
          groupName: e.target.value,
        };
      }
      return group;
    });

    setGroups([...newGroupsValue]);
  };

  const handleItemValueChange = (e, groupMapId, itemMapId) => {
    const newGroupsValue = groups.map((group, id) => {
      if (id === groupMapId) {
        const newAttributes = [...group.attributes];
        console.log(itemMapId, newAttributes[itemMapId]);
        newAttributes[itemMapId].attributeName = e.target.value;

        return {
          ...group,
          attributes: [...newAttributes],
        };
      }
      return group;
    });

    setGroups([...newGroupsValue]);
  };

  console.log(groups);

  return (
    <div className={cx("groups-new")}>
      <div className={cx("groups-new-container")}>
        {groups?.map((group, id) => {
          return (
            <div className={cx("attribute-wrapper")} key={id}>
              <div className={cx("attribute-container")}>
                <div className={cx("attribute-group-wrapper")}>
                  <div className={cx("attribute-group")}>
                    <input
                      value={group.groupName}
                      onChange={(e) => handleGroupValueChange(e, id)}
                      name="group"
                      placeholder="Nhập tên nhóm thông số..."
                      required
                    />
                    <button
                      type="button"
                      className={cx({
                        expend: expendGroups.includes(id),
                      })}
                      onClick={() => handleGroupExpand(id)}
                    >
                      <ArrowDownIcon />
                    </button>
                  </div>
                  <button type="button" onClick={() => handleDelateGroup(id)}>
                    <TrashIcon />
                  </button>
                </div>

                <div
                  className={cx("attribute-items", {
                    expend: expendGroups.includes(id),
                  })}
                >
                  <div className={cx("attribute-item-blank")}>
                    {group.attributes.map((attribute, i) => {
                      return (
                        <div className={cx("attribute-item")} key={i}>
                          <ArrowRightIcon />
                          <input
                            value={attribute.attributeName}
                            onChange={(e) => handleItemValueChange(e, id, i)}
                            name="item"
                            placeholder="Nhập thông số kĩ thuật..."
                            required
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div>
                    <button type="button" onClick={() => handleAddItem(id)}>
                      <PlusIcon />
                    </button>
                    <button type="button" onClick={() => handleDelateItem(id)}>
                      <MinusIcon />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <button onClick={handleAddGroup} type="button">
          Thêm nhóm
        </button>
      </div>
      <button type="submit">Submit</button>
    </div>
  );
}

function SpecificationSection() {
  const { categories } = useProductInfoFormGetContext();
  const [specModified, setSpecModified] = useState([]);
  const [currentCate, setCurrentCate] = useState();
  const [expendGroups, setExpendGroups] = useState([]);
  const [groupsValue, setGroupsValue] = useState([]);

  useEffect(() => {
    const fetchSpec = async () => {
      try {
        const res = await attributeService.getAttributeByCategory(currentCate);
        setSpecModified(res.data.data);
      } catch (error) {}
    };

    if (!!currentCate) {
      fetchSpec();
    } else {
      setSpecModified([]);
    }
  }, [currentCate]);

  useEffect(() => {
    const lastGroup = specModified[specModified.length - 1];

    const groupDisplayOrder =
      specModified.length > 0 ? lastGroup.display_order + 100000 : 100000;

    const newGroupValue = {
      groupName: "",
      displayOrder: groupDisplayOrder,
      attributes: [
        { attributeName: "", displayOrder: 100000, isFilterable: 0 },
      ],
    };

    if (!!currentCate) {
      setGroupsValue([...[newGroupValue]]);
    } else {
      setGroupsValue([]);
    }
  }, [specModified]);

  const handleGroupExpand = (group_id) => {
    let newExpendGroup;
    if (expendGroups.includes(group_id)) {
      newExpendGroup = expendGroups.filter((expG, i) => expG !== group_id);
    } else {
      newExpendGroup = [...expendGroups, group_id];
    }
    setExpendGroups([...newExpendGroup]);
  };

  const specificationsHtml = specModified?.map((group, id) => {
    return (
      <div className={cx("attribute-wrapper")} key={id}>
        <div className={cx("attribute-container")}>
          <div
            className={cx("attribute-group")}
            onClick={() => handleGroupExpand(group.group_id)}
          >
            <span>{group.group_name}</span>
            <button
              className={cx({
                expend: expendGroups.includes(group.group_id),
              })}
            >
              <ArrowDownIcon />
            </button>
          </div>
          <div
            className={cx("attribute-items", {
              expend: expendGroups.includes(group.group_id),
            })}
          >
            {group.attributes.map((attribute, attributeMapId) => {
              return (
                <div className={cx("attribute-item")} key={attributeMapId}>
                  <div>
                    <ArrowRightIcon />
                    <span>{attribute.attribute_name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  });

  const fetchCreateGroupSpec = async (e) => {
    e.preventDefault();
    console.log(12);
    try {
      const res = await attributeService.createGroup(currentCate, groupsValue);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={fetchCreateGroupSpec}>
      <div className={cx("wrapper")}>
        <div className={cx("container")}>
          <div>
            <select
              onChange={(e) => setCurrentCate(e.target.value)}
              value={currentCate}
              name="category"
              id="category"
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
          <div className={cx("blank")}>
            {!!currentCate && (
              <GroupsSpec
                groups={groupsValue}
                setGroups={setGroupsValue}
                specModified={specModified}
              />
            )}
            <div className={cx("groups-exist")}>{specificationsHtml}</div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default SpecificationSection;
