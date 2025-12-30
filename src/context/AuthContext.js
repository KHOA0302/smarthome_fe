import { createContext, useContext, useState } from "react";
import authService from "../api/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("jwt_token"));
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user_info"))
  );

  const login = async (username, password) => {
    const response = await authService.login(username, password);
    const { token: newToken, user: userData } = response.data;

    localStorage.setItem("jwt_token", newToken);
    localStorage.setItem("user_info", JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);

    return userData;
  };

  const logout = async () => {
    await authService.logout();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
