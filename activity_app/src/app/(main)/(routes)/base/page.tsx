"use client";
import Inbox from "../../_components/index";
import { PrimaryNav } from "../../_components/PrimaryNav";

const MainPage = () => {
  return ( 
    <>
      <div className="border-b border-gray-200">
        <PrimaryNav />
      </div>
      <Inbox/>
    </>
  );
}

export default MainPage;
