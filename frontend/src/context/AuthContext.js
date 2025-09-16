import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api"; // Nếu có API, nếu không bỏ qua

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);          // <— NEW
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setIsLoggedIn(true);
        setUserName(userData.name || "Người dùng");
        setRole(userData.role ?? null);
        setUser(userData);                         // <— NEW
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        setUserName("");
        setRole(null);
        setUser(null);                             // <— NEW
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setIsLoggedIn(true);
    setUserName(userData.name || "Người dùng");
    setRole(userData.role ?? null);
    setUser(userData);                             // <— NEW
  };

  const logout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserName("");
    setRole(null);
    setUser(null);                                 // <— NEW
  };

  const updateUserInfo = (newInfo) => {            // <— NEW
    setUser((prev) => {
      const updated = { ...(prev || {}), ...newInfo };
      localStorage.setItem("user", JSON.stringify(updated));
      setUserName(updated.name || "Người dùng");
      if (updated.role !== undefined) setRole(updated.role);
      return updated;
    });
  };

  const contextValue = {
    isLoggedIn,
    userName,
    role,
    user,                                          // <— NEW
    login,
    logout,
    updateUserInfo,                                // <— NEW
    loading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);