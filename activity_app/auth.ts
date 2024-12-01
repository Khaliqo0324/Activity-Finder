import connectMongoDB from "../../Campus-Club-Locator/activity_app/src/app/(libs)/mongodb";
import { User } from "@/app/(models)/UserSchema";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import bcrypt from 'bcryptjs';

import {authConfig} from 'auth.config';


import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"

interface Credentials {
    email: string;
    password: string;
  }

function createCredentialsProvider() {
    return CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Credentials | unknown) {
        await connectMongoDB();
        if (!credentials) return null;

        const { email, password } = credentials as Credentials;

        try {
          const user = await User.findOne({ email: email }).lean<MyUser>();
            
          if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
  
            if (isMatch) {
              return {
                
                email: user.email,
                name: user.password,
              };
            } else {
              console.log("Email or Password is not correct");
              return null;
            }
          } else {
            console.log("User not found");
            return null;
          }
        } catch (error) {
          console.error("An error occurred:", error);
          return null;
        }
      },
    });
  }















export const {
    handlers: { GET, POST},
    auth,
    signIn,
    signOut,
} = NextAuth({
    ...authConfig,
    providers: [createCredentialsProvider],
});
       