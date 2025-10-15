import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, Home, User ,Users} from "lucide-react";
import { api, clearTokens } from "../utils/api";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await api.logout();
      clearTokens();
      navigate("/login");
    } catch (error) {
      clearTokens();
      navigate("/login");
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-gradient-to-r from-[#18230F] to-[#27391C] text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            to="/feed"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="bg-[#255F38] p-2 rounded-lg">
              <Home size={24} />
            </div>
            <h1 className="text-2xl font-bold">Post Dunia</h1>
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              to="/feed"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive("/feed")
                  ? "bg-[#255F38] text-white"
                  : "hover:bg-[#27391C]"
              }`}
            >
              <Home size={18} />
              <span className="hidden md:inline">Feed</span>
            </Link>

            <Link
              to="/profile"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive("/profile")
                  ? "bg-[#255F38] text-white"
                  : "hover:bg-[#27391C]"
              }`}
            >
              <User size={18} />
              <span className="hidden md:inline">MY POSTS</span>
            </Link>
            <Link
              to="/other"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive("/other")
                  ? "bg-[#255F38] text-white"
                  : "hover:bg-[#27391C]"
              }`}
            >
              <Users size={18} />
              <span className="hidden md:inline">OTHERS POSTS</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden md:inline">Logout</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
