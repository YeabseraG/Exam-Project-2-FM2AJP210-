import { useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <header className="border-b border-stone-200 bg-[#fffaf3] shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link
          to="/"
          className="text-3xl font-extrabold tracking-tight text-[#174e4f]"
        >
          Holidaze
        </Link>

        <button
          type="button"
          onClick={() =>
            setMobileMenuOpen((current) => !current)
          }
          className="text-3xl text-[#174e4f] md:hidden"
        >
          ☰
        </button>

        <div className="hidden items-center gap-7 text-lg font-medium text-stone-700 md:flex">
          <Link
            to="/"
            className="transition hover:text-[#174e4f]"
          >
            Venues
          </Link>

          {isLoggedIn && (
            <Link
              to="/profile"
              className="transition hover:text-[#174e4f]"
            >
              Profile
            </Link>
          )}

          {isLoggedIn &&
            user?.venueManager && (
              <Link
                to="/manager"
                className="transition hover:text-[#174e4f]"
              >
                Manager Dashboard
              </Link>
            )}

          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="transition hover:text-[#174e4f]"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded bg-[#174e4f] px-5 py-2.5 text-white transition hover:bg-[#123b3c]"
              >
                Register
              </Link>
            </>
          ) : (
            <button
              type="button"
              onClick={logout}
              className="rounded bg-[#174e4f] px-5 py-2.5 text-white transition hover:bg-[#123b3c]"
            >
              Logout
            </button>
          )}
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="border-t border-stone-200 bg-[#fffaf3] px-6 py-5 md:hidden">
          <div className="flex flex-col gap-5 text-lg font-medium text-stone-700">
            <Link
              to="/"
              onClick={closeMobileMenu}
            >
              Venues
            </Link>

            {isLoggedIn && (
              <Link
                to="/profile"
                onClick={closeMobileMenu}
              >
                Profile
              </Link>
            )}

            {isLoggedIn &&
              user?.venueManager && (
                <Link
                  to="/manager"
                  onClick={closeMobileMenu}
                >
                  Manager Dashboard
                </Link>
              )}

            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="w-fit rounded bg-[#174e4f] px-5 py-2.5 text-white"
                >
                  Register
                </Link>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  logout();
                  closeMobileMenu();
                }}
                className="w-fit rounded bg-[#174e4f] px-5 py-2.5 text-left text-white"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;