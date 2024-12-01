"use client";

import EventForm from "../../_components/Form";
import { PrimaryNav } from "../../_components/PrimaryNav";

const TestPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <PrimaryNav />
      <main className="container mx-auto p-4 space-y-6">
        <EventForm />
      </main>
    </div>
  );
};

export default TestPage;