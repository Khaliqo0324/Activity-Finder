"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const SignUpForm = () => {
  const [showPassword, setShowPassword] = React.useState(false);

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
          <form className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="What is your e-mail?"
                className="w-full"
              />
            </div>
            
            <div className="relative space-y-2">
              <Input
                type={showPassword ? "text" : "password"}
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

            <Button className="w-full" variant="default">
              Continue
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