import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      try {
        setUser(JSON.parse(userInfo));
      } catch (error) {
        localStorage.removeItem("userInfo");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // --- DUMMY DATA BYPASS (Matches your Seed File) ---

    // 1. Regular User (Alice)
    if (email === "user@example.com" && password === "password123") {
      const customer = {
        _id: "65f1a2b3c4d5e6f7a8b9c0d1",
        name: "Alice Customer",
        email: "user@example.com",
        token: "mock-jwt-customer",
        role: "user",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice"
      };
      return completeLogin(customer);
    }

    // 2. Shopkeeper (John)
    if (email === "shop@example.com" && password === "password123") {
      const shopkeeper = {
        _id: "65f1a2b3c4d5e6f7a8b9c0d2",
        name: "John Shopkeeper",
        email: "shop@example.com",
        token: "mock-jwt-shopkeeper",
        role: "shopkeeper",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
      };
      return completeLogin(shopkeeper);
    }
    // -----------------------------------------------

    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      return completeLogin(data);
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed"
      };
    }
  };

  // Helper function to handle storage and state
  const completeLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("userInfo", JSON.stringify(userData));
    return { success: true, role: userData.role };
  };

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("userInfo");
    window.location.href = "/";
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};