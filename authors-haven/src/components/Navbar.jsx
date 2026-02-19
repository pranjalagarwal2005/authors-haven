import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg flex items-center gap-2 ${isActive
      ? "bg-teal-400 text-black"
      : "text-gray-600 hover:text-black"
    }`;

  return (
    <header className="flex justify-between items-center px-10 py-5 bg-[#f8f7f3] shadow-sm">
      <h1
        onClick={() => navigate("/dashboard")}
        className="text-2xl font-bold text-indigo-800 cursor-pointer"
      >
        📖 Author&apos;s Haven
      </h1>

      <nav className="flex gap-2">
        <NavLink to="/dashboard" className={linkClass}>
          📘 Dashboard
        </NavLink>
        <NavLink to="/writing" className={linkClass}>
          ✍️ Writing
        </NavLink>
        <NavLink to="/characters" className={linkClass}>
          👥 Characters
        </NavLink>
        <NavLink to="/relationship" className={linkClass}>
          🔗 Relationships
        </NavLink>
        <NavLink to="/research" className={linkClass}>
          💡 Search
        </NavLink>
        <NavLink to="/world" className={linkClass}>
          🗺️ World
        </NavLink>
      </nav>

      <div className="relative">
        {user ? (
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <span className="text-gray-700 font-medium">
              Hello, {user.displayName || user.email.split('@')[0]}
            </span>
            <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
              {(user.displayName || user.email).charAt(0).toUpperCase()}
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/auth")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Sign In
          </button>
        )}

        {isDropdownOpen && user && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-100">
            <div className="px-4 py-2 text-sm text-gray-700 border-b">
              <p className="font-bold truncate">{user.displayName || "User"}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                navigate("/profile");
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              👤 Profile
            </button>
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                handleLogout();
              }}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
