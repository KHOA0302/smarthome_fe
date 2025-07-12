import { useState } from "react";
import authService from "../../../api/authService";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await authService.login(username, password);

      const { token, user } = response.data;

      localStorage.setItem("jwt_token", token);
      localStorage.setItem("user_info", JSON.stringify(user));

      if (user && user.role_name) {
        if (user.role_name === "admin" || user.role_name === "data_entry") {
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
    <div className="login-container">
      <h2>Đăng nhập</h2>
      <form onSubmit={handleLogin}>
        {error && (
          <p className="error-message" style={{ color: "red" }}>
            {error}
          </p>
        )}
        <div>
          <label htmlFor="username">Tên đăng nhập:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
        </div>
        <div>
          <label htmlFor="password">Mật khẩu:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <button type="submit">Đăng nhập</button>
      </form>
    </div>
  );
}

export default Login;
