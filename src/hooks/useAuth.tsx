import { createContext, useContext } from "react";

interface Permission {
  id: number;
  name: string;
}

interface AuthContextType {
  permissions: Permission[];
}

export const AuthContext = createContext<AuthContextType>({ permissions: [] });

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthContext.Provider");
  }

  
  const can = (permissionName: string) => {
    return context.permissions.some((p) => p.name === permissionName);
  };

  return { ...context, can };
};