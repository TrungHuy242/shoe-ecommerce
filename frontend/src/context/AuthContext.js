import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api"; // Nếu có API, nếu không bỏ qua

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setIsLoggedIn(true);
        setUserName(userData.name || "Người dùng");
        setRole(userData.role || null);
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        setUserName("");
        setRole(null);
      }
    }
    setLoading(false); // Set loading to false after rehydration
  }, []);

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setIsLoggedIn(true);
    setUserName(userData.name || "Người dùng");
    setRole(userData.role);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserName("");
    setRole(null);
  };

  const contextValue = {
    isLoggedIn,
    userName,
    role,
    login,
    logout,
    loading, // Add loading to context
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading ? children : <div>Loading...</div>} {/* Conditionally render children */}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);