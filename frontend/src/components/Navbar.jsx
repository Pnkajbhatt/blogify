import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import {
  FaPlus,
  FaUser,
  FaTachometerAlt,
  FaSignOutAlt,
  FaSignInAlt,
} from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">Blogify</h1>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to="/post/new"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  <FaPlus />
                  Create Post
                </Link>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition font-medium"
                >
                  <FaTachometerAlt />
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition font-medium"
                >
                  <FaUser />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 transition font-medium"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition font-medium"
                >
                  <FaSignInAlt />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
