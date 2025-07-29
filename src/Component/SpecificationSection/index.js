import { useEffect, useState } from "react";
import styles from "./SpecificationSection.module.scss";
import classNames from "classnames/bind";
import { useProductInfoFormGetContext } from "../../Pages/Admin/ProductInfoForm";
import { attributeService } from "../../api/attributeService";
import { ArrowDownIcon, ArrowRightIcon } from "../../icons";

const cx = classNames.bind(styles);

function SpecificationSection() {
  const { categories } = useProductInfoFormGetContext();
  const [specModified, setSpecModified] = useState([]);
  const [currentCate, setCurrentCate] = useState();
  const [expendGroups, setExpendGroups] = useState([]);

  useEffect(() => {
    const fetchSpec = async () => {
      try {
        const res = await attributeService.getAttributeByCategory(currentCate);
        setSpecModified(res.data.data);
      } catch (error) {}
    };

    if (!!currentCate) {
      fetchSpec();
    }
  }, [currentCate]);

  console.log(specModified);

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
    console.log(group);
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
              console.log(attribute);
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

  return (
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
        <div>{specificationsHtml}</div>
      </div>
    </div>
  );
}

export default SpecificationSection;
