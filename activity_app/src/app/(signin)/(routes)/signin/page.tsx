"use client";
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const SignInForm = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Here you would typically:
      // 1. Validate the form
      // 2. Send credentials to your authentication endpoint
      // 3. Handle the response

      // For now, we'll just simulate a brief loading state
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to landing page using window.location
      window.location.href = '/';  // Change '/' to your landing page path
    } catch (error) {
      console.error('Sign in error:', error);
      // Handle error (show error message, etc.)
    } finally {
      setIsLoading(false);
    }
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email address"
                className="w-full"
                required
              />
            </div>
            
            <div className="relative space-y-2">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full pr-10"
                required
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
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
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