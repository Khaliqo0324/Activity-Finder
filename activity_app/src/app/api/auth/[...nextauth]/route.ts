
import connectMongoDB from "../../../(libs)/mongodb";
import { User } from "@/app/(models)/UserSchema";
import { NextResponse } from "next/server";
import { NextApiRequest } from "next";
import bcrypt from 'bcryptjs';

import {authConfig} from 'auth.config';


import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
//import bcrypt from "bcryptjs";
//import { User } from "./src/app/(models)/UserSchema";

//import { NextResponse } from 'next/server';
//import bcrypt from 'bcryptjs';
//import { User } from '../app/(models)/UserSchema'; 
//import connectMongoDB from "../app/(libs)/mongodb";
//export {signIn, signOut} from "next-auth/react";


// Import your user model

export async function POST(request: Request) {
    
    await connectMongoDB();
  try {
    console.log("user model", User);
    const body = await request.json(); // Parse the request body
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    // Find user in the database
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Simulate token/session creation (replace with your auth logic)
    //const token = 'fake-jwt-token'; // Replace with real JWT or session token logic

    return NextResponse.json({ message: 'Login successful'}, { status: 200 });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
