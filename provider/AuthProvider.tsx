"use client";

import { createContext, useEffect, useState } from "react";
import { useContext } from "react";

import { auth } from "@/service/firebase";

const Context = createContext({});

type UserT = {
  user: any;
  isLogin: boolean;
};

const AuthProvider = ({ children }: any) => {
  const initialState = {
    user: null,
    isLogin: false,
  };
  const [user, setUser] = useState<UserT>(initialState);

  useEffect(() => {
    const subscribe = auth.onAuthStateChanged((userState) => {
      setUser({ isLogin: userState ? true : false, user: userState });
    });
    return subscribe;
  }, []);

  return (
    <Context.Provider value={{ user, setUser }}>{children}</Context.Provider>
  );
};

export const AuthContext = () => useContext(Context);
export default AuthProvider;
