import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router"
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

  
  const handleLogin = async (e:React.FormEvent) => {
    e.preventDefault(); 
    setLoading(true);
    setError("");

    try {
      
      const API_URL = "http://192.168.100.186:1010/api/login"; 

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        
        localStorage.setItem("token", data.token);
        
       
        localStorage.setItem("user", JSON.stringify(data.user));

       
        navigate("/dashboard");
      } else {
        
        setError(data.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError("Something went wrong. Cannot connect to server.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full items-center justify-center bg-gray-50 p-2">
      <Card className="w-full max-w-md min-h-[480px] flex flex-col justify-between rounded-md shadow-lg">
        
        <CardHeader className="flex flex-col items-center gap-5">
          <div className="flex items-center justify-center bg-[#0070EB] w-22 h-22 rounded-3xl">
            <BsBoxFill className="w-12 h-12 text-white" />
          </div>
          <CardTitle className="text-center font-bold text-black text-xl flex flex-col items-center">
            ITAMS
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              
              
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-100 rounded-sm font-medium">
                  {error}
                </div>
              )}
              
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-black font-semibold">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="bg-gray-200 h-12 rounded-sm border-none focus-visible:ring-1"
                  required
                 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password" className="text-black font-semibold">
                  Password
                </Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password" 
                    className="bg-gray-200 h-12 rounded-sm pr-10 border-none focus-visible:ring-1" 
                    required 
                   
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
                  >
                    {showPassword ? <LuEye size={18} /> : <LuEyeClosed size={18} />}
                  </button>
                </div>
              </div>

            </div>
            
            
            <CardFooter className="flex-col gap-4 px-0 pt-6">
              <Button 
                type="submit" 
                className="w-full h-12 font-bold rounded-lg" 
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
              <Link
                to="/forget-password"
                className="mx-auto inline-block text-sm underline-offset-4 text-center hover:underline text-blue-500 font-medium"
              >
                Forgot your password?
              </Link>
            </CardFooter>
          </form>
        </CardContent>
        
      </Card>
    </div>
  )
}

export default Login