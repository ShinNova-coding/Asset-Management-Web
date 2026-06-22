import { createContext, useContext } from "react";


// Use optional (?) fields so it accepts objects with or without those extra API keys
interface Permission {
  id: number;
  name: string;
 
}

interface AuthContextType {
  permissions: Permission[];
}

export const AuthContext = createContext<AuthContextType>({ permissions: [] });
export const useAuth = () => useContext(AuthContext);
