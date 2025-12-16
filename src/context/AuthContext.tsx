import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import axios from "axios";
import { type User } from "../types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("user");

    if (t && u) {
      const parsedUser = JSON.parse(u);

      if (!parsedUser.is_staff) {
        // prevent normal users from entering admin
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return;
      }

      setToken(t);
      setUser(parsedUser);
      axios.defaults.headers.common["Authorization"] = `Bearer ${t}`;
    }
  }, []);

  const login = (t: string, u: User) => {
    if (!u.is_staff) {
      throw new Error("Not an admin user");
    }

    setToken(t);
    setUser(u);

    localStorage.setItem("token", t);
    localStorage.setItem("user", JSON.stringify(u));

    axios.defaults.headers.common["Authorization"] = `Bearer ${t}`;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
