import Link from 'next/link';

const Navbar = () => (
  <nav className="w-full flex items-center justify-between py-4 px-8 bg-white shadow-md">
    {/* Logo */}
    <div className="flex items-center">
      <img src="/logo.png" alt="Logo" className="h-8 w-8 mr-2" />
      <span className="text-xl font-bold text-gray-800">Activity Finder</span>
    </div>

    {/* Navigation Links */}
    <div className="flex items-center space-x-6">
      <Link href="/about" className="text-gray-600 hover:text-gray-800">
        About
      </Link>
      <button className="px-8 py-3 border border-gray-900 text-gray-900 rounded-full hover:bg-gray-900 hover:text-white transition duration-300">
          Signup
        </button>
    </div>
  </nav>
);

export default Navbar;

