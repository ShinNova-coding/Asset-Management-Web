import { useState } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/Router";
import { AuthContext } from "@/hooks/useAuth";

const App = () => {
  
  const [permissions, setPermissions] = useState(() => {
    const saved = localStorage.getItem("user_permissions");
    return saved ? JSON.parse(saved) : [];
  });

  

  return (
    <AuthContext.Provider value={{ permissions: permissions }}>
      <RouterProvider router={router} />
    </AuthContext.Provider>
  );
};

export default App;