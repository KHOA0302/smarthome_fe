import styles from "./Register.module.scss";
import classNames from "classnames/bind";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../../api/authService";
import { GoogleLogin } from "@react-oauth/google";
import banner from "../../../images/household-electric-devices.jpg";
import { EyeCloseIcon, EyeOpenIcon } from "../../../icons";
const cx = classNames.bind(styles);
function Register() {
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  console.log(process.env.REACT_APP_GOOGLE_CLIENT_ID);
  const handleSubmit = async (e) => {
    console.log(process.env.REACT_APP_GOOGLE_CLIENT_ID);
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu và xác nhận mật khẩu không khớp!");
      setLoading(false);
      return;
    }

    try {
      const userData = {
        email: formData.email,
        full_name: formData.fullName,
        password: formData.password,
      };
      const res = await authService.register(userData);
      const data = res.data;

      if (res.status === 201) {
        console.log(data.message);
        console.log(data.user);
        navigate("/login", { replace: true });
      } else if (res.status === 200) {
        console.log(data.message);
        console.log(data.user);
        navigate("/", { replace: true });
      } else {
        setError("Đăng ký thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Lỗi kết nối hoặc lỗi hệ thống:", err);
      setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSubmit = async (credentialResponse) => {
    console.log("Google credential response:", credentialResponse);

    try {
      const res = await authService.googleSign(credentialResponse.credential);
      console.log(
        "Đăng nhập/Đăng ký Google thành công (qua @react-oauth/google):",
        res
      );

      console.log(res.data.message);
      localStorage.setItem("jwt_token", res.data.token);
      localStorage.setItem("user_info", JSON.stringify(res.data.user));
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Lỗi khi xử lý đăng nhập Google ở Frontend:", error);
      alert(
        error.response?.data?.message ||
          "Đăng nhập Google thất bại. Vui lòng thử lại."
      );
    }
  };

  const handleGoogleFailure = (error) => {
    console.log("Đăng nhập Google thất bại:", error);
    alert("Đăng nhập Google thất bại. Vui lòng thử lại.");
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("banner")}>
          <img src={banner} />
        </div>
        <div className={cx("form-wrapper")}>
          <h2>Đăng ký</h2>
          {error && <p>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className={cx("email")}>
              <label htmlFor="email">email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Nhập email..."
              />
            </div>
            <div className={cx("full-name")}>
              <label htmlFor="fullName">fullname</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Nhập tên..."
              />
            </div>
            <div className={cx("password")}>
              <label htmlFor="password">password</label>
              <div>
                <input
                  type={showPass.includes("password") ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Nhập mật khẩu..."
                />
                <button
                  type="button"
                  className={cx({ show: showPass.includes("password") })}
                  onClick={() =>
                    showPass.includes("password")
                      ? setShowPass((prev) => [
                          ...prev.filter((s) => s !== "password"),
                        ])
                      : setShowPass((prev) => [...prev, "password"])
                  }
                >
                  {showPass.includes("password") ? (
                    <EyeOpenIcon />
                  ) : (
                    <EyeCloseIcon />
                  )}
                </button>
              </div>
            </div>
            <div className={cx("conform-password")}>
              <label htmlFor="confirmPassword">confirm-password</label>
              <div>
                <input
                  type={
                    showPass.includes("confirmPassword") ? "text" : "password"
                  }
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Nhập lại mật khẩu..."
                />
                <button
                  type="button"
                  className={cx({ show: showPass.includes("confirmPassword") })}
                  onClick={() =>
                    showPass.includes("confirmPassword")
                      ? setShowPass((prev) => [
                          ...prev.filter((s) => s !== "confirmPassword"),
                        ])
                      : setShowPass((prev) => [...prev, "confirmPassword"])
                  }
                >
                  {showPass.includes("confirmPassword") ? (
                    <EyeOpenIcon />
                  ) : (
                    <EyeCloseIcon />
                  )}
                </button>
              </div>
            </div>
            <div className={cx("regis-btn")}>
              <button type="submit" disabled={loading}>
                {loading ? "Đang đăng ký..." : "Đăng ký"}
              </button>
              <span> or </span>
              <GoogleLogin
                onSuccess={handleGoogleSubmit}
                onError={handleGoogleFailure}
              />
            </div>
          </form>
          <p>
            Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
