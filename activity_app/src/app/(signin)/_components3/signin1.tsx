'use client';
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { signIn, signOut } from "@/auth";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import bcrypt from 'bcryptjs';





/** 
export async function doLogout() {
  await signOut({ redirectTo: "/"});
}


export async function doLogin(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  try {
    const resp = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return resp;
    window.location.href = "/base";
  } catch (err: any) {
    console.log(err);
    throw err;

  }
}
*/
const makeRequest = async (url: string, content: object ) => {
  const handleReq = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      
    },
    body: JSON.stringify(content),
  });
  if(handleReq.ok) {
    const result = await handleReq.json();
    console.log('signin worked');
    window.location.href = '/base';
    return result;
  } else {
    console.log('something went wrong');
  }

};

  


export async function SignInForm()  {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState(""); 
    

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    
    e.preventDefault();
    
    const User = {

      email: email,
      password: password,
    };
  
     makeRequest('/api/auth/[...nextauth]', User);
     if (email != "" && password != "") {
      setEmail("");
      setPassword("");
      
    } 
   try {
     
        const response = signIn("credentials", {
          email,
          password,
          redirect: false,
        });
        return response;
      } catch (err: any) {
        throw err;
      }
     

      
      // Here you would typically:
      // 1. Validate the form
      // 2. Send credentials to your authentication endpoint
      // 3. Handle the response

      // For now, we'll just simulate a brief loading state
      //await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to landing page using window.location
      //window.location.href = '/base';  // Change '/' to your landing page path
   
    
     
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Welcome Back 👋
          </CardTitle>
          <p className="text-sm text-gray-600">
            Sign in to your account
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} id="login" className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                onChange={(e)=> setEmail(e.target.value)}
                value={email}
                placeholder="Email address"
                className="w-full"
                required
              />
            </div>
            
            <div className="relative space-y-2">
              <Input
                type={"pass"}
                placeholder="Password"
                onChange={(e)=> setPassword(e.target.value)}
                value={password}
                className="w-full pr-10"
                required
              />
              <button
                type="button"
                //onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {//(
                 // <EyeOffIcon className="h-5 w-5" />
                //) : (
                 // <EyeIcon className="h-5 w-5" />
                }
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm">
                <input type="checkbox" className="rounded border-gray-300" />
                <span>Remember me</span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </a>
            </div>

            <Button 
              className="w-full" 
              variant="default"
              type="submit"
              //disabled={isLoading}
            >
              {"Sign In"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full" type="button">
                Google
              </Button>
              <Button variant="outline" className="w-full" type="button">
                GitHub
              </Button>
            </div>

            <div className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="/signup" className="text-blue-600 hover:underline">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInForm;