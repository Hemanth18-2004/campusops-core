"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

import { User } from "@/src/types/auth";

interface AuthContextType {
  user: User | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext =
  createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [user,setUser]=useState<User|null>(null);

  useEffect(()=>{

    const token=localStorage.getItem("token");

    if(token){

      const storedUser=localStorage.getItem("user");

      if(storedUser){

        setUser(JSON.parse(storedUser));

      }

    }

  },[]);

  function login(user:User,token:string){

    localStorage.setItem("token",token);

    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    setUser(user);

  }

  function logout(){

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    setUser(null);

  }

  return(

    <AuthContext.Provider
      value={{
        user,
        login,
        logout
      }}
    >

      {children}

    </AuthContext.Provider>

  );

}

export function useAuth(){

  const context=useContext(AuthContext);

  if(!context){

    throw new Error("AuthProvider Missing");

  }

  return context;

}