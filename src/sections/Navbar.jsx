import { useState } from "react";
import { navLinks } from "../constants/index.js";
import { Link } from 'react-router-dom';

const NavItems = () => (
  <ul className="nav-ul">
    {navLinks.map((item) => (
      <li key={item.id} className="nav-li">
        <Link to={item.href} className="nav-li_a">
          {item.name}
        </Link>
      </li>
    ))}
  </ul>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prevState) => !prevState);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-red-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center py-3 mx-auto c-space">
          <Link
            to="/"
            className="text-neutral-200 font-telex font-bold text-3xl hover:text-white transition-colors flex justify-center items-center"
          >
            <img
              src="/assets/logo.png"
              alt="Football Icon"
              className="h-12 w-12 mr-2"
            />
            Supply Management
          </Link>

          <button
            onClick={toggleMenu}
            className="text-neutral-400 hover:text-white focus:outline-none sm:hidden flex mr-2"
            aria-label="Toggle menu"
          >
            <img
              src={isOpen ? "/assets/close.svg" : "/assets/menu.svg"}
              alt="toggle"
              className="w-6 h-6"
            />
          </button>

          <nav className="sm:flex hidden">
            <NavItems />
          </nav>
        </div>
      </div>

      <div className={`nav-sidebar ${isOpen ? "max-h-screen" : "max-h-0"}`}>
        <nav className="p-5">
          <NavItems onClick={closeMenu} />
        </nav>
      </div>
    </header>
  );
};

export default Navbar;