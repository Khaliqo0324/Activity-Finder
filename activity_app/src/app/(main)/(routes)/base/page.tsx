"use client";
import Inbox from "../../_components/index";
import { PrimaryNav } from "../../_components/PrimaryNav";
import { Button } from "@/components/ui/button";
import Link from "next/link";
const MainPage = () => {
  return ( 
    <>
      <div className="border-b border-gray-200">
        <PrimaryNav />
      </div>
      <div >
      
      </div>
      <Inbox/>
    </>
  );
}

export default MainPage;
//