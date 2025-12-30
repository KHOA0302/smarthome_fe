import { useEffect, useState } from "react";
import styles from "./ServiceEditSection.module.scss";
import classNames from "classnames/bind";
import { serviceService } from "../../api/serviceService";
import Tippy from "@tippyjs/react";
import { toast, ToastContainer } from "react-toastify";
const cx = classNames.bind(styles);
function ServiceEditSection({ chosenCate }) {
  const [services, setServices] = useState([]);
  const [submitService, setSubmitService] = useState({});

  const fetchServices = async () => {
    try {
      const res = await serviceService.getServiceFilter(chosenCate);
      setServices(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [chosenCate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const editPromise = serviceService.editService(submitService);

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
        const { service_name, service_id } = res.data.data;
        const newServices = services.map((service) => {
          if (service.service_id === service_id) {
            return {
              ...service,
              service_name: service_name,
            };
          }
          return service;
        });
        setServices(newServices);
      });
  };

  const handleChoseService = (service) => {
    if (service.service_id === submitService?.service_id) {
      setSubmitService({ service_name: "" });
      return;
    }
    setSubmitService({
      service_id: service.service_id,
      service_name: service.service_name,
    });
  };

  const handleChange = (e) => {
    if (!submitService.service_id) return;
    setSubmitService((prev) => ({
      ...prev,
      service_name: e.target.value,
    }));
  };

  return (
    <div className={cx("wrapper")}>
      <form onSubmit={handleSubmit} className={cx("form")}>
        <h4>Cập nhật dịch vụ: </h4>
        <div className={cx("input-box")}>
          <Tippy content="stt">
            <label htmlFor="service">#{submitService?.service_id}</label>
          </Tippy>
          <input
            type="text"
            id="service"
            name="service"
            value={submitService?.service_name}
            placeholder="Chọn 1 service"
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
        {services.map((service, id) => {
          console.log(service);
          const category = service?.category;
          return (
            <div
              key={id}
              className={cx("service-wrapper", {
                active: submitService.service_id === service.service_id,
              })}
              onClick={() => handleChoseService(service)}
            >
              <div
                className={cx("service-container", {
                  active: submitService.service_id === service.service_id,
                })}
              >
                <span className={cx("id")}>#{service.service_id}</span>
                <span className={cx("service-name")}>
                  {service.service_name}
                </span>
                <span className={cx("category-name")}>
                  {category?.category_name || "ALL"}
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

export default ServiceEditSection;
