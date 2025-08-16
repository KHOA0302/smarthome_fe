import { useEffect, useReducer, useState } from "react";
import authService from "../../../api/authService";
import styles from "./Dashboard.module.scss";
import classNames from "classnames/bind";
import { initState, reducer } from "./reducer";
import { toast, ToastContainer } from "react-toastify";
const cx = classNames.bind(styles);

const normalizeString = (str) => {
  if (typeof str !== "string") return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};
const searchAddress = (dataList, searchTerm) => {
  const normalizedSearchTerm = normalizeString(searchTerm)
    .split(/\s+/)
    .filter(Boolean);

  return dataList.filter((province) => {
    if (!province || typeof province.name !== "string") {
      return false;
    }

    const normalizedProvinceName = normalizeString(province.name);

    return normalizedSearchTerm.every((termWord) =>
      normalizedProvinceName.includes(termWord)
    );
  });
};

function Dashboard() {
  const [activeSetting, setActiveSetting] = useState([]);
  const [state, dispatch] = useReducer(reducer, initState);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [onFocus, setOnFocus] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://provinces.open-api.vn/api/v2/");
        const res = await fetch("https://provinces.open-api.vn/api/v2/w/");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const dataProvinces = await response.json();
        setProvinces(dataProvinces);
        const dataDistricts = await res.json();
        setDistricts(dataDistricts);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      dispatch({ type: "FETCH_START" });
      try {
        const res1 = await authService.getCurrentUser();
        const res2 = await authService.getUserInfo();

        const newUser = {
          id: res1.id,
          name: res1.full_name,
          email: res1.email,
          phoneNumber: res2.data.phone_number,
          province: res2.data.province,
          district: res2.data.district,
          houseNumber: res2.data.house_number,
          isProfileComplete: res2.data.is_profile_complete,
          google_sub_id: res2.data.google_sub_id,
          login_method: res2.data.login_method,
        };

        console.log(res2.data);

        dispatch({ type: "FETCH_SUCCESS", payload: newUser });
      } catch (error) {
        console.error(error);
        dispatch({ type: "FETCH_ERROR", payload: error.message });
      }
    };
    fetchUser();
  }, []);

  const handleEditUser = (data, type) => {
    dispatch({ type: type, payload: data });
  };

  const handleChangeProvince = (e) => {
    dispatch({ type: "EDIT-PROVINCE", payload: e.target.value });
    const provinceSearchData = searchAddress(provinces, e.target.value);
    dispatch({ type: "SET-PROVINCE-SEARCH-DATA", payload: provinceSearchData });
  };

  const handleChangeDistrict = (e) => {
    dispatch({ type: "EDIT-DISTRICT", payload: e.target.value });
    if (state.provinceSearchData.length === 1) {
      const dataDistricts = districts.filter(
        (district) =>
          district.province_code === state.provinceSearchData[0].code
      );
      const districtSearchData = searchAddress(dataDistricts, e.target.value);

      dispatch({
        type: "SET-DISTRICT-SEARCH-DATA",
        payload: districtSearchData,
      });
    }
  };

  const handleActive = (position) => {
    if (activeSetting.includes(position)) {
      const newActiveSetting = activeSetting.filter(
        (active) => active != position
      );
      setActiveSetting([...newActiveSetting]);
    } else {
      setActiveSetting((prev) => [...prev, position]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      loading,
      error,
      provinceSearchData,
      districtSearchData,
      ...restOfState
    } = state;
    const updatePromise = authService.editUserinfo(restOfState);

    toast.promise(updatePromise, {
      pending: "Đang cập nhật thông tin...",
      success: "Cập nhật thông tin thành công! 🎉",
      error: {
        render({ data }) {
          return `Cập nhật thất bại: ${data.message}`;
        },
      },
    });
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <h1>Thông tin người dùng</h1>
        <form onSubmit={handleSubmit} className={cx("blank")}>
          <div className={cx("user")}>
            <button
              type="button"
              className={cx({ active: activeSetting.includes("on") })}
              onClick={() => handleActive("on")}
            >
              <span>SỬA</span>
            </button>
            <div className={cx("top")}>
              <div className={cx("user-name")}>
                <label>Tên</label>
                {activeSetting.includes("on") ? (
                  <input
                    name="name"
                    value={state.name}
                    onChange={(e) =>
                      handleEditUser(e.target.value, "EDIT-NAME")
                    }
                    required
                  />
                ) : (
                  <span>{state.name}</span>
                )}
              </div>

              <div className={cx("user-phone")}>
                <label>Sđt</label>
                {activeSetting.includes("on") ? (
                  <input
                    name="phone"
                    type="number"
                    value={state.phoneNumber}
                    onChange={(e) =>
                      handleEditUser(e.target.value, "EDIT-PHONE")
                    }
                    required
                  />
                ) : (
                  <span>{state.phoneNumber}</span>
                )}
              </div>

              <div className={cx("user-email")}>
                <label>Email</label>
                <span>{state.email}</span>
              </div>
            </div>
          </div>
          <div className={cx("user")}>
            <button
              type="button"
              className={cx({ active: activeSetting.includes("bottom") })}
              onClick={() => handleActive("bottom")}
            >
              <span>SỬA</span>
            </button>
            <div className={cx("bottom")}>
              <div className={cx("bottom-wrapper")}>
                <div className={cx("user-province")}>
                  {activeSetting.includes("bottom") ? (
                    <input
                      value={state.province}
                      name="province"
                      onChange={handleChangeProvince}
                      onFocus={() => setOnFocus("province")}
                      onBlur={() => setOnFocus("")}
                      autoComplete="off"
                    />
                  ) : (
                    <span>{state.province}</span>
                  )}
                  {onFocus === "province" && (
                    <ul className={cx("search-select")}>
                      {state.provinceSearchData?.map((province, id) => {
                        return (
                          <li
                            onClick={() => {
                              dispatch({
                                type: "SET-PROVINCE-SEARCH-DATA",
                                payload: [province],
                              });
                              handleEditUser(province.name, "EDIT-PROVINCE");
                            }}
                            onMouseDown={(e) => e.preventDefault()}
                            key={id}
                          >
                            {province.name}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                <div className={cx("user-district")}>
                  {activeSetting.includes("bottom") ? (
                    <input
                      value={state.district}
                      name="district"
                      onChange={handleChangeDistrict}
                      onFocus={() => setOnFocus("district")}
                      onBlur={() => setOnFocus("")}
                      autoComplete="off"
                    />
                  ) : (
                    <span>{state.district}</span>
                  )}
                  {onFocus === "district" && (
                    <ul className={cx("search-select")}>
                      {state.districtSearchData?.map((district, id) => (
                        <li
                          onClick={() => {
                            dispatch({
                              type: "SET-DISTRICT-SEARCH-DATA",
                              payload: [district],
                            });
                            handleEditUser(district.name, "EDIT-DISTRICT");
                          }}
                          onMouseDown={(e) => e.preventDefault()}
                          key={id}
                        >
                          {district.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className={cx("user-house_number")}>
                {activeSetting.includes("bottom") ? (
                  <input
                    value={state.houseNumber}
                    name="house-number"
                    onChange={(e) =>
                      handleEditUser(e.target.value, "EDIT-HOUSE-NUMBER")
                    }
                  />
                ) : (
                  <span>{state.houseNumber}</span>
                )}
              </div>
            </div>
          </div>

          {activeSetting.length >= 1 && (
            <button type="submit" className={cx("submit-btn")}>
              LƯU
            </button>
          )}
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Dashboard;
