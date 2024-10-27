import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

const NavItems = ({ onLogout, role, isLoggedIn }) => {
  const links = [
     { id: 2, name: "Scheduler", href: "/scheduler", roles: ["scheduler"] },
    { id: 3, name: "Dashboard", href: "/dashboard", roles: ["surgeon"] },
    { id: 4, name: "Appointment", href: "/appointment", roles: ["surgeon"] },
  ];

  return (
    <ul className="nav-ul">
      {links
        .filter((link) => isLoggedIn && (!link.roles || link.roles.includes(role)))
        .map((item) => (
          <li key={item.id} className="nav-li">
            <Link to={item.href} className="nav-li_a">
              {item.name}
            </Link>
          </li>
        ))}
      {!isLoggedIn && (
        <li className="nav-li">
          <Link to="/login" className="nav-li_a">
            Login
          </Link>
        </li>
      )}
      {isLoggedIn && (
        <li className="nav-li flex items-center gap-2 cursor-pointer" onClick={onLogout}>
          <LogOut className="w-5 h-5 text-neutral-200" />
          <span className="text-neutral-200">Logout</span>
        </li>
      )}
    </ul>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLogin") === "true");
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      const storedRole = localStorage.getItem("role");
      const loginStatus = localStorage.getItem("isLogin") === "true";

      if (storedRole !== role || loginStatus !== isLoggedIn) {
        setRole(storedRole);
        setIsLoggedIn(loginStatus);
      }
    }, 1000); // Check every 1 second

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [role, isLoggedIn]);

  const toggleMenu = () => setIsOpen((prevState) => !prevState);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setRole(null);
    navigate("/login");
    closeMenu();
  };

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
              alt="Supply Management Logo"
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
            <NavItems onLogout={handleLogout} role={role} isLoggedIn={isLoggedIn} />
          </nav>
        </div>
      </div>

      <div className={`nav-sidebar ${isOpen ? "max-h-screen" : "max-h-0"}`}>
        <nav className="p-5">
          <NavItems onLogout={handleLogout} role={role} isLoggedIn={isLoggedIn} />
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
