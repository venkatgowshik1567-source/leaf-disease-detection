import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Leaf, Menu, X } from "lucide-react";

const navLinks = [
  { to: "/",          label: "Home"      },
  { to: "/detect",    label: "Detect"    },
  { to: "/analytics", label: "Analytics" },
  { to: "/history",   label: "History"   },
  { to: "/about",     label: "About"     },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-emerald-950/85 backdrop-blur-md shadow-md border-b border-emerald-500/20 sticky top-0 z-50 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-extrabold text-base sm:text-lg text-emerald-300 tracking-wide uppercase hover:text-white transition-colors">
            <span className="bg-emerald-600 text-white p-1.5 rounded-lg shrink-0 shadow-md">
              <Leaf size={18} />
            </span>
            AI BASED LEAF DISEASE DETECTION SYSTEM
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-emerald-100 hover:bg-emerald-800/60 hover:text-white"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <Link to="/detect" className="ml-3 btn-primary text-sm py-2 px-4 bg-emerald-600 hover:bg-emerald-500 shadow-md">
              Detect Disease
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-primary-50 text-primary-700 font-bold" : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}
