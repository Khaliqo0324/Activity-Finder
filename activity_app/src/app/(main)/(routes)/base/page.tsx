"use client";
import { PrimaryNav } from "../../_components/PrimaryNav";
import SearchInbox from "../../_components/SearchResult";

const LandingPage = () => {
  return ( 
    <>
      <div className="border-b border-gray-200">
        <PrimaryNav />
      </div>
      <SearchInbox />
    </>
  );
}

export default LandingPage;
