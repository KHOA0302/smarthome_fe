import styles from "./ServiceSection.module.scss";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { useProductInfoFormGetContext } from "../../Pages/Admin/ProductAdd";
import { serviceService } from "../../api/serviceService";
import { AllIcon } from "../../icons";
const cx = classNames.bind(styles);
function ServiceSection() {
  const { categories } = useProductInfoFormGetContext();
  const [servicesModified, setServicesModified] = useState([]);
  const [currentCate, setCurrentCate] = useState("");
  const [serviceValue, setServiceValue] = useState({
    name: "",
    for: "one",
  });

  useEffect(() => {
    const fetchServiceFilter = async () => {
      try {
        const res = await serviceService.getServiceFilter(currentCate);
        setServicesModified([...res.data.data]);
      } catch (error) {}
    };
    if (!!currentCate) {
      fetchServiceFilter();
    }
  }, [currentCate]);

  const handleFor = () => {
    if (serviceValue.for === "all") {
      setServiceValue((prev) => {
        return { ...prev, for: "one" };
      });
    } else {
      setServiceValue((prev) => {
        return { ...prev, for: "all" };
      });
      setServicesModified([]);
      setCurrentCate("");
    }
  };

  const fetchCreateService = async (e) => {
    e.preventDefault();
    try {
      const res = await serviceService.createService(
        currentCate,
        serviceValue.name
      );

      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={fetchCreateService}>
      <div className={cx("wrapper")}>
        <div className={cx("container")}>
          <div className={cx("service-new")}>
            <input
              value={serviceValue.name}
              onChange={(e) =>
                setServiceValue({
                  ...serviceValue,
                  name: e.target.value,
                })
              }
              placeholder="Vui lòng nhập dịch vụ...."
              name="service-value"
              required
            />
          </div>
          <div className={cx("category-service_exist")}>
            <div className={cx("category")}>
              <div className={cx("category-blank")}>
                <select
                  disabled={serviceValue.for === "all"}
                  className={cx({ [serviceValue.for]: true })}
                  onChange={(e) => setCurrentCate(e.target.value)}
                  value={currentCate}
                  name="category"
                  id="category"
                  required={serviceValue.for === "one"}
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
                <button
                  className={cx({ [serviceValue.for]: true })}
                  onClick={handleFor}
                  type="button"
                >
                  {serviceValue.for.toUpperCase()}
                </button>
              </div>

              <button type="submit">Gửi</button>
            </div>
            <div className={cx("service-exist")}>
              <ul>
                {servicesModified.map((serviceModified, id) => {
                  console.log(serviceModified);
                  return <li key={id}>{serviceModified.service_name}</li>;
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default ServiceSection;
