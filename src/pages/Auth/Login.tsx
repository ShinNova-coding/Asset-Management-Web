import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router"
import { LuEyeClosed, LuEye } from "react-icons/lu";
import { useState } from "react"
import { BsBoxFill } from "react-icons/bs"

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setLoading(true);
    setError("");

    try {
      const API_URL = "http://192.168.100.185:1011/api/login"; 
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        let exactRoleName = "Employee"; 
        let exactPermissions = []; 

        if (data.user?.roles?.length > 0) {
          exactRoleName = data.user.roles[0].name; 
          exactPermissions = data.user.roles[0].permissions || [];
          
          if (exactPermissions.length === 0) {
          
            if (exactRoleName === "super-admin") {
               exactPermissions = [{ id: 7, name: "view-assets" }, { id: 12, name: "view-users" }, { id: 26, name: "view-dashboard" }, { id: 28, name: "view-assignments" }, { id: 33, name: "view-maintenances" },{ id: 2, name: "view-categories" }, { id: 17, name: "view-roles" }, { id: 49, name: "view-expenses" }, { id: 58, name: "view-activitylogs" }];
            } else if (exactRoleName === "Admin") {
               exactPermissions = [{ id: 7, name: "view-assets" }, { id: 12, name: "view-users" }, { id: 26, name: "view-dashboard" }, { id: 28, name: "view-assignments" }, { id: 2, name: "view-categories" }, { id: 33, name: "view-maintenances" }];
            } else if (exactRoleName === "HR") {
               exactPermissions = [{ id: 2, name: "view-categories" }, { id: 7, name: "view-assets" }, { id: 26, name: "view-dashboard" }, { id: 28, name: "view-assignments" }, { id: 33, name: "view-maintenances" }, { id: 37, name: "get-notifications" }];
            } else if (exactRoleName === "Employee") {
               exactPermissions = [{ id: 2, name: "view-categories" }, { id: 2, name: "view-categories" },{ id: 33, name: "view-maintenances" }, { id: 7, name: "view-assets" }, { id: 29, name: "view-assignments" }];
            }
          }
        }

        localStorage.setItem("user_role", exactRoleName);
        localStorage.setItem("user_permissions", JSON.stringify(exactPermissions)); 
        window.location.href = "/dashboard";
      } else {
        setError(data.message || "Login failed.");
      }
    } catch (err) {
      setError("Something went wrong. Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3F0F7] p-6 text-white font-sans">
      <div className="flex w-full max-w-5xl bg-blue-800 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 min-h-[500px]">
        
       
        <div className="w-full lg:w-1/2 p-12 flex flex-col justify-center bg-slate-950">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Welcome</h2>
            <p className="text-slate-400">Enter your credentials to access the secure ITAMS dashboard.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            {error && <div className="p-3 text-sm text-red-500 bg-red-950/50 rounded-lg border border-red-800">{error}</div>}
            
            <div className="grid gap-2">
              <Label className="text-slate-300">Email Address</Label>
              <Input 
                className="bg-slate-900 border-slate-700 h-12 rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder=""
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label className="text-slate-300">Password</Label>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"}
                  className="bg-slate-900 border-slate-700 h-12 rounded-xl pr-10"
                  placeholder=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-4 text-slate-500">
                  {showPassword ? <LuEye size={18} /> : <LuEyeClosed size={18} />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 bg-blue-800 hover:bg-blue-500 rounded-xl font-bold text-white transition-all" disabled={loading}>
              {loading ? "Logging in..." : "LogIn"}
            </Button>
          </form>
        </div>

       
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-900/20 to-slate-900 items-center justify-center p-12 border-l border-slate-800">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-6 border border-blue-500/30 rounded-full flex items-center justify-center animate-pulse">
               <BsBoxFill className="w-16 h-16 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2 tracking-wider">ITAMS</h3>
            <p className="text-slate-400 text-sm max-w-xs mx-auto">
              IT asset management system
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;