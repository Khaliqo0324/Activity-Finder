import Link from 'next/link';

const Footer = () => (
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
    </div>
  </nav>
);

export default Footer;

