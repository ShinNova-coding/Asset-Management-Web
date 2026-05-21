import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Link, useNavigate } from "react-router-dom";

import { LuEyeClosed, LuEye } from "react-icons/lu";
import { FaArrowLeft } from "react-icons/fa";

import { useState } from "react";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();

   
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

   
    alert("Password reset successful!");

    
    navigate("/");
  };

  return (
    <div className="min-h-screen flex w-full items-center justify-center bg-gray-50 p-2">
      <Card className="w-full max-w-md rounded-md shadow-lg">
        <CardHeader className="flex flex-col items-center gap-5">
          <CardTitle className="text-center font-bold text-black text-xl">
            Create Your Password
          </CardTitle>
        </CardHeader>

       
        <form onSubmit={handleResetPassword}>
          <CardContent className="space-y-5">
          
            <div className="grid gap-2">
              <Label
                htmlFor="password"
                className="text-black font-semibold"
              >
                New Password
              </Label>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-200 h-12 rounded-sm pr-10 border-none focus-visible:ring-1"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
                >
                  {showPassword ? (
                    <LuEye size={18} />
                  ) : (
                    <LuEyeClosed size={18} />
                  )}
                </button>
              </div>
            </div>

            
            <div className="grid gap-2">
              <Label
                htmlFor="confirmPassword"
                className="text-black font-semibold"
              >
                Confirm New Password
              </Label>

              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Repeat your new password..."
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  className="bg-gray-200 h-12 rounded-sm pr-10 border-none focus-visible:ring-1"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
                >
                  {showPassword ? (
                    <LuEye size={18} />
                  ) : (
                    <LuEyeClosed size={18} />
                  )}
                </button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full">
              Reset Password
            </Button>

            <Link
              to="/"
              className="text-blue-500 flex items-center gap-2 justify-center"
            >
              <FaArrowLeft size={14} />
              Back To Login
            </Link>
          </CardFooter>
        </form>
        
      </Card>
    </div>
  );
}