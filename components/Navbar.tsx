"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, userData, loading, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo and Brand */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/zephyr-logo.svg"
              width={32}
              height={32}
              alt="Zephyr Logo"
            />
            <span className="ml-2 text-xl font-bold text-primary">Zephyr</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className="text-text-alt hover:text-primary transition"
          >
            Home
          </Link>
          <Link
            href="/leaderboard"
            className="text-text-alt hover:text-primary transition"
          >
            Leaderboard
          </Link>

          {!loading && user ? (
            <>
              <Link
                href="/profile"
                className="text-text-alt hover:text-primary transition"
              >
                Profile
              </Link>
              <Link
                href="/settings"
                className="text-text-alt hover:text-primary transition"
              >
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
              >
                Logout
              </button>
              <div className="flex items-center ml-4">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                  {userData?.username.charAt(0).toUpperCase()}
                </div>
                <span className="ml-2">{userData?.username}</span>
              </div>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-text p-2"
          >
            {isMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 bg-white shadow-md rounded-md p-4">
          <div className="flex flex-col space-y-4">
            <Link
              href="/"
              className="text-text-alt hover:text-primary transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/leaderboard"
              className="text-text-alt hover:text-primary transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Leaderboard
            </Link>

            {!loading && user ? (
              <>
                <Link
                  href="/profile"
                  className="text-text-alt hover:text-primary transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className="text-text-alt hover:text-primary transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                >
                  Logout
                </button>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                    {userData?.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="ml-2">{userData?.username}</span>
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 transition text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
