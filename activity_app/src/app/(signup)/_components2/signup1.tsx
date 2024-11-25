"use client";

import useState from 'react';
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import {useRouter} from 'next/navigation';


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
    console.log('signup worked');
    return result;
  } else {
    console.log('something went wrong');
  }

};



const SignUpForm = () => {
    const [showPassword, setShowPassword] = React.useState(false);
  
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState(""); 
    const User = {

      email: email,
      password: password,
    };
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      makeRequest('/api/signup', User);
      if (email != "" && password != "") {
        setEmail("");
        setPassword("");
        window.location.href = '/base';
      }
      
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Let's Get Started 🚀
            </CardTitle>
            <p className="text-sm text-gray-600">
              Sign up your account
            </p>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Input
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email} 
                  placeholder="What is your e-mail?"
                  className="w-full"
                />
              </div>
              
              <div className="relative space-y-2">
                <Input
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}  
                  placeholder="Enter your password"
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
                  
              <Button type="submit" className="w-full" variant="default">
                Connect
              </Button>
  
              <p className="text-xs text-center text-gray-600">
                By continuing you agree to our{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms & Conditions
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </p>
  
              <div className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <a href="/signin" className="text-blue-600 hover:underline">
                  Log in
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  export default SignUpForm;