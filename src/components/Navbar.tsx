import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();

  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <Link to="/" className="text-xl font-bold">
          Holidaze
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/">Venues</Link>

          {isLoggedIn && (
            <Link to="/profile">Profile</Link>
          )}

          {isLoggedIn && user?.venueManager && (
            <Link to="/manager">Manager Dashboard</Link>
          )}

          {!isLoggedIn ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          ) : (
            <button type="button" onClick={logout}>
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;