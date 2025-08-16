import styles from "./Login.module.scss";
import classNames from "classnames/bind";
import { useState } from "react";
import authService from "../../../api/authService";
import { useNavigate } from "react-router-dom";
import { EyeCloseIcon, EyeOpenIcon } from "../../../icons";
import banner from "../../../images/household-electric-devices.jpg";
import { GoogleLogin } from "@react-oauth/google";
const cx = classNames.bind(styles);
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await authService.login(username, password);

      const { token, user } = response.data;

      localStorage.setItem("jwt_token", token);
      localStorage.setItem("user_info", JSON.stringify(user));

      if (user && user.role_name) {
        if (user.role_name === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else if (user.role_name === "customer") {
          navigate("/customer/dashboard", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } else {
        console.warn(
          "Role information not found in user data. Navigating to home."
        );
        navigate("/", { replace: true });
      }
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.message
        : "Đăng nhập thất bại. Vui lòng thử lại.";
      setError(errorMessage);
      console.error("Lỗi đăng nhập:", error);
    }
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("form-wrapper")}>
          <div className={cx("banner")}>
            <img src={banner} />
          </div>
          <form onSubmit={handleLogin} className={cx("form")}>
            <h2>Đăng nhập</h2>
            {error && (
              <p className="error-message" style={{ color: "red" }}>
                {error}
              </p>
            )}
            <div className={cx("username")}>
              <label htmlFor="username">username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
            <div className={cx("password")}>
              <label htmlFor="password">password</label>
              <div>
                <input
                  type={showPass ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className={cx({ show: showPass })}
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <EyeOpenIcon /> : <EyeCloseIcon />}
                </button>
              </div>
            </div>
            <div className={cx("btn")}>
              <button type="submit">Đăng nhập</button>
              <button onClick={() => navigate("/register")} type="button">
                Đăng kí
              </button>
            </div>
            <GoogleLogin
              onSuccess={handleGoogleSubmit}
              onError={handleGoogleFailure}
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
