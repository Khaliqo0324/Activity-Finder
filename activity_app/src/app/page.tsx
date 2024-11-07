// pages/index.tsx

import type { NextPage } from 'next';
import Navbar from './components/navbar';
import Footer from './components/footer';

const Home: NextPage = () => {
  return (
    <>
      <Navbar />
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center px-6">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Discover Your Next Activity
          </h1>
          <p className="text-gray-600 text-lg md:text-xl mb-8">
            Find exciting activities around you tailored to your interests.
          </p>
          <button className="px-8 py-3 border border-gray-900 text-gray-900 rounded-full hover:bg-gray-900 hover:text-white transition duration-300">
            Get Started
          </button>
          <div className="">
            <img src="/landing.jpg" alt="Logo" className="w-2/3 mx-auto" />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;

