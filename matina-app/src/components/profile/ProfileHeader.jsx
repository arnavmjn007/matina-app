import { useState } from 'react';
import { User, ChevronDown, ChevronUp } from 'lucide-react';
import heartsLogo from '../../assets/images/hearts.png';

function ProfileHeader({ navigateTo }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    // Updated className for the liquid glass effect
    // This uses a lighter, semi-transparent white background with a blur, border, and shadow.
    <header className="p-2 md:p-4 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg shadow-lg border border-white/20 rounded-b-3xl flex items-center justify-between w-full">
      {/* Logo and App Name */}
      <div className="flex items-center space-x-2">
        <img
          src={heartsLogo}
          alt="Matina Logo"
          className="w-6 h-6 md:w-8 md:h-8 object-contain"
        />
        {/* Changed text color to a darker shade for better contrast */}
        <span className="text-xl md:text-2xl font-bold text-gray-800">Matina</span>
      </div>

      {/* Navigation Links */}
      {/* Changed text color and hover effect */}
      <nav className="flex space-x-4 md:space-x-8 text-gray-800 font-medium">
        <button onClick={() => navigateTo('chats')} className="hover:text-pink-600 transition-colors">Chats</button>
        <button onClick={() => navigateTo('liked')} className="hover:text-pink-600 transition-colors">Liked</button>
        <button onClick={() => navigateTo('discovery')} className="hover:text-pink-600 transition-colors">Discovery</button>
      </nav>

      {/* User Avatar/Profile Icon with Dropdown */}
      <div className="relative">
        {/* Changed text and hover colors */}
        <button
          onClick={toggleDropdown}
          className="flex items-center space-x-2 text-gray-800 hover:text-pink-600 transition-colors p-2 rounded-full hover:bg-white/30"
        >
          <User className="w-6 h-6 md:w-8 md:h-8" />
          {isDropdownOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
            <button
              onClick={() => { navigateTo('edit-profile'); setIsDropdownOpen(false); }}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              Edit Profile
            </button>
            <button
              onClick={() => { navigateTo('settings'); setIsDropdownOpen(false); }}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              Settings
            </button>
            <button
              onClick={() => { navigateTo('contact-faqs'); setIsDropdownOpen(false); }}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              Contact Us & FAQs
            </button>
            <button
              onClick={() => { navigateTo('logout'); setIsDropdownOpen(false); }}
              className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default ProfileHeader;
