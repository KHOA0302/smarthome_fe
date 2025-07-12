import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../../api/authService";
import { GoogleLogin } from "@react-oauth/google";

function Register() {
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

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
    <div>
      <div>
        <h2>Đăng ký tài khoản</h2>
        {error && <p>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Nhập địa chỉ email của bạn"
            />
          </div>
          <div>
            <label htmlFor="fullName">Họ và Tên:</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="Nhập họ và tên đầy đủ"
            />
          </div>
          <div>
            <label htmlFor="password">Mật khẩu:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Nhập mật khẩu"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword">Xác nhận mật khẩu:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Nhập lại mật khẩu"
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>

        <div>
          <span>Hoặc</span>
        </div>

        <GoogleLogin
          onSuccess={handleGoogleSubmit}
          onError={handleGoogleFailure}
        />

        <p>
          Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
