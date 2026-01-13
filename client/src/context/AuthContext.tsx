import React, { createContext, useContext, useReducer, ReactNode } from "react";
import api from "@/services/api";
import { User, AuthState } from "@/types";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
};

type AuthAction =
  | { type: "SET_USER"; payload: User }
  | { type: "LOGOUT" };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // 🔐 LOGIN (BACKEND)
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.post("/auth/login", { email, password });
      dispatch({ type: "SET_USER", payload: res.data });
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  // 📝 REGISTER (BACKEND)
  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      dispatch({ type: "SET_USER", payload: res.data });
      return true;
    } catch (error) {
      console.error("Register failed:", error);
      return false;
    }
  };

  // 🚪 LOGOUT (BACKEND)
  const logout = async () => {
    try {
      await api.post("/auth/logout"); // optional endpoint
    } catch (err) {
      console.warn("Logout error ignored");
    }
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
