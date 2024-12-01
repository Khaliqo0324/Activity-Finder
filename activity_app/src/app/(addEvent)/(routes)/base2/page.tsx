"use client";

import {Navbar} from "../../_components/Navbar";
import App from "../../_components/AddEvent";
import { Button } from "@/components/ui/button";
const LandingPage = () => {
  return ( 
    <>
      <div className="border-b border-gray-200">
       <Navbar/>  
      </div>
        <h1 className="text-base sm:text-xl md:text-2xl font-bold mt-4  underline flex justify-center">
            Add events to map.
        </h1>
        <div className="white flex items-center justify-center min-h-screen">
        <App/>
       
        </div>
       
        </> 
  );
}

export default LandingPage;