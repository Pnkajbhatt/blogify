import React from "react";

function Navbar() {
  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">Blogify</h1>
          </div>
          <div className="text-sm text-gray-500">
            Phase 4 – MVP
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;