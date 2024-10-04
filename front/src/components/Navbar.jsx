import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { Signout } from './Signout';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-zinc-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-white text-2xl font-bold">
          Invenhub
        </div>

        {/* Hamburger Icon for Mobile */}
        <div className="lg:hidden">
          <button onClick={toggleMenu} className="text-white text-3xl">
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Menu Links */}
        <div className={`lg:flex lg:items-center lg:gap-8 ${isOpen ? 'block' : 'hidden'} w-full lg:w-auto`}>
          <ul className="lg:flex lg:gap-8 text-white text-center lg:text-left">
            <li className="py-2 lg:py-0">
              <a href="\dashboard" className="hover:text-gray-300">Dasboard</a>
            </li>
            <li className="py-2 lg:py-0">
              <a href="\inventory" className="hover:text-gray-300">Inventory</a>
            </li>
            <li className="py-2 lg:py-0">
              <a href="\products" className="hover:text-gray-300">Products</a>
            </li>
            <li className="py-2 lg:py-0">
              <a href="\update" className="hover:text-gray-300">Update</a>
            </li>
            <li className="py-2 lg:py-0">
              <a href="\user" className="hover:text-gray-300">User</a>
            </li>
            <li className="py-2 lg:py-0">
              <a href="\ai" className="hover:text-gray-300">ChatBot</a>
            </li>
            <li className="py-2 lg:py-0">
              <a href="\predict" className="hover:text-gray-300">Predict</a>
            </li>
          </ul>

          {/* Optional Button */}
          <div className="mt-4 lg:mt-0">
            {/* <a href="#login" className="block lg:inline-block bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100">
              Login
            </a> */}
            <Signout />
          </div>
        </div>
      </div>
    </nav>
  );
}
