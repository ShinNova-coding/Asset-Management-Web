import { useState } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/Router";
import { AuthContext } from "@/hooks/useAuth";

const App = () => {
  const [permissions] = useState(() => {
    const saved = localStorage.getItem("user_permissions");
    if (!saved) return [];

    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      localStorage.removeItem("user_permissions");
      return [];
    }
  });

  return (
    <AuthContext.Provider value={{ permissions: permissions }}>
      <RouterProvider router={router} />
    </AuthContext.Provider>
  );
};

export default App;
