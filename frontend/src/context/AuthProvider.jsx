import React, { useState, useEffect, useRef } from "react";
import { AuthContext } from "./AuthContext";
import { jwtDecode } from "jwt-decode";
import io from "socket.io-client";

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: null, user: null });
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const socket = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        if (decodedUser.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
        } else {
          setAuth({ token, user: decodedUser });
        }
      } catch (error) {
        console.error(error);
        localStorage.removeItem("token");
      }
    }
    setIsAuthLoading(false);
  }, []);

  useEffect(() => {
    if (auth.user) {
      socket.current = io("http://localhost:3001");
      socket.current.emit("addUser", auth.user.id);
    } else {
      if (socket.current) {
        socket.current.disconnect();
        socket.current = null;
      }
    }

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [auth.user]);

  const login = (token) => {
    localStorage.setItem("token", token);
    const decodedUser = jwtDecode(token);
    setAuth({ token, user: decodedUser });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuth({ token: null, user: null });
  };

  return (
    <AuthContext.Provider
      value={{ auth, login, logout, socket, isAuthLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
