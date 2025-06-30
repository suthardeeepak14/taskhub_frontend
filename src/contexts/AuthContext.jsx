import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData && userData !== "undefined") {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } catch (err) {
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post("/login", { username, password });
      const { access_token, user: userData } = response.data;

      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(userData));

      api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
      setUser(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || "Login failed",
      };
    }
  };

  const register = async (email, password, name) => {
    try {
      const response = await api.post("/register", {
        username: name,
        email,
        password,
      });

      const { access_token, user: userData } = response.data;

      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(userData));

      api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
      setUser(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    navigate("/login");
  };
  useEffect(() => {
    if (user && window.location.pathname === "/login") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
