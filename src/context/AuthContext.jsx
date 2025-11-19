// frontend/src/context/AuthContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import { USE_MOCKS } from "../api/base";
import { mockLogin } from "../mocks/mockBackend";
// если есть реальный API для логина:
// import { apiLogin } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      if (user.token) {
        localStorage.setItem("token", user.token);
      }
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, [user]);

  async function login(email, password) {
    if (USE_MOCKS) {
      const res = await mockLogin(email, password);
      const loggedUser = {
        id: res.id,
        email: res.email,
        role: res.role,
        token: res.access_token,
      };
      setUser(loggedUser);
      return;
    }

    // Реальный вариант (оставляем закомментированным для будущего)
    /*
    const res = await apiLogin({ email, password });
    const loggedUser = {
      id: res.id,
      email: res.email,
      role: res.role,
      token: res.access_token,
    };
    setUser(loggedUser);
    */
  }

  function logout() {
    setUser(null);
  }

  const value = { user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
