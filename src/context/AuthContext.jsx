// frontend/src/context/AuthContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import { USE_MOCKS } from "../api/base";
import { mockLogin } from "../mocks/mockBackend";
import { loginRequest, registerRequest } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  const [loading, setLoading] = useState(false);

  // синхронизация user <-> localStorage
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

  // === ЛОГИН ===
  async function login(email, password) {
    setLoading(true);
    try {
      let res;

      if (USE_MOCKS) {
        res = await mockLogin(email, password);
      } else {
        res = await loginRequest(email, password);
      }

      const loggedUser = {
        id: res.id,
        email: res.email,
        role: res.role,
        token: res.access_token,
      };

      setUser(loggedUser);
      return loggedUser;
    } catch (error) {
      // пробрасываем ошибку наверх для LoginPage
      throw error instanceof Error ? error : new Error("Ошибка входа");
    } finally {
      setLoading(false);
    }
  }

  // === РЕГИСТРАЦИЯ ===
  async function register(email, password) {
    setLoading(true);
    try {
      let res;
      console.log(123);
      if (USE_MOCKS) {
        console.log(123);
        // Если захочешь — можешь сделать mockRegister.
        // Пока допустим, что мок-логин и регистрация одно и то же.
        res = await mockLogin(email, password);
      } else {
        console.log(123);
        res = await registerRequest(email, password);
      }

      const registeredUser = {
        id: res.id,
        email: res.email,
        role: res.role,
        token: res.access_token,
      };

      // После регистрации сразу авторизуем пользователя
      setUser(registeredUser);
      return registeredUser;
    } catch (error) {
      throw error instanceof Error ? error : new Error("Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setUser(null);
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
