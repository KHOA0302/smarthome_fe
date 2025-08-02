import { useEffect, useReducer, useState } from "react";
import authService from "../../../api/authService";
import styles from "./Dashboard.module.scss";
import classNames from "classnames/bind";
import { initState, reducer } from "./reducer";
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
const searchProvinces = (dataList, searchTerm) => {
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
  const [onFocus, setOnFocus] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://provinces.open-api.vn/api/?depth=2"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProvinces(data);
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
        };

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
    const provinceSearchData = searchProvinces(provinces, e.target.value);

    dispatch({ type: "SET-PROVINCE-SEARCH-DATA", payload: provinceSearchData });
  };

  console.log(state);

  const handleChangeDistrict = (e) => {
    if (state.provinceSearchData.length === 1) {
      const districtSearchData = searchProvinces(
        state.provinceSearchData[0].districts,
        e.target.value
      );

      dispatch({
        type: "SET-DISTRICT-SEARCH-DATA",
        payload: districtSearchData,
      });
    }
  };

  const fetchEditUser = (e) => {
    e.preventDefault();
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

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <h1>Thông tin người dùng</h1>
        <form onSubmit={fetchEditUser} className={cx("blank")}>
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
                  <input value={state.name} required />
                ) : (
                  <span>{state.name}</span>
                )}
              </div>

              <div className={cx("user-phone")}>
                <label>Sđt</label>
                {activeSetting.includes("on") ? (
                  <input value={state.phoneNumber} required />
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
                      // value={state.province}
                      name="province"
                      onChange={handleChangeProvince}
                      onFocus={() => setOnFocus("province")}
                      onBlur={() => setOnFocus("")}
                    />
                  ) : (
                    <span>{state.province}</span>
                  )}
                  {onFocus === "province" && (
                    <ul className={cx("search-select")}>
                      {state.provinceSearchData?.map((province) => {
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
                      // value={state.district}
                      name="district"
                      onChange={handleChangeDistrict}
                      onFocus={() => setOnFocus("district")}
                      onBlur={() => setOnFocus("")}
                    />
                  ) : (
                    <span>{state.district}</span>
                  )}
                  {onFocus === "district" && (
                    <ul className={cx("search-select")}>
                      {state.districtSearchData?.map((province) => (
                        <li
                          onClick={() => {
                            dispatch({
                              type: "SET-DISTRICT-SEARCH-DATA",
                              payload: [province],
                            });
                            handleEditUser(province.name, "EDIT-DISTRICT");
                          }}
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          {province.name}
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
    </div>
  );
}

export default Dashboard;
