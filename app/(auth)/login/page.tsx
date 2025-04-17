"use client";
import TextForm from "@/components/UI/TextForm";
import Button from "@/components/UI/Button";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function Page() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  // Form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Error states
  const [error, setError] = useState("");

  // Refs for form submission
  const formRef = useRef(null);

  function LoginSuccess() {
    router.push("/");
  }

  function SignupSuccess() {
    router.push("/");
  }

  const toggleForm = () => {
    setIsLogin(!isLogin);
    // Clear form fields and errors when switching
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleLogin = () => {
    // Reset error
    setError("");

    // Simple validation
    if (!username) {
      setError("Username or email is required");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    // Mock login check - implement database checking later
    if (username !== "demo" && username !== "demo@example.com") {
      setError("Username not found");
      return;
    }

    if (password !== "password123") {
      setError("Incorrect password");
      return;
    }

    // If we get here, login was successful
    LoginSuccess();
  };

  const handleSignup = () => {
    // Reset error
    setError("");

    // Validation
    if (!username) {
      setError("Username is required");
      return;
    }

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // If we get here, signup was successful. Implement adding account into database
    SignupSuccess();
  };

  // Handle form submission
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (isLogin) {
      handleLogin();
    } else {
      handleSignup();
    }
  };

  return (
    <div className="flex w-screen h-screen overflow-hidden relative">
      {/* Background Images - Static positions */}
      <div className="absolute inset-0 flex">
        <div className="w-1/2 h-full relative">
          <Image src="/bg.svg" fill alt="Background" className="object-cover" />
        </div>
        <div className="w-1/2 h-full relative">
          <Image src="/bg.svg" fill alt="Background" className="object-cover" />
        </div>
      </div>

      {/* Sliding White Panel */}
      <motion.div
        className="absolute h-full bg-white"
        initial={false}
        animate={{
          left: isLogin ? "50%" : "0%",
          width: "50%",
        }}
        transition={{
          duration: 0.6,
          ease: "easeInOut",
        }}
      >
        {/* Container for all content to ensure proper positioning */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Logo with animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login-logo" : "signup-logo"}
              className={`absolute top-4 ${isLogin ? "right-4" : "left-4"}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src="/zephyr-logo.svg"
                width={56}
                height={56}
                alt="Zephyr Logo"
              />
            </motion.div>
          </AnimatePresence>

          {/* Login Form Content - Only interactive when visible */}
          {isLogin && (
            <motion.div
              className="w-4/5 max-w-md p-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <h1 className="font-bold text-3xl mb-2 mt-12">Login</h1>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  toggleForm();
                }}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    toggleForm();
                  }
                }}
              >
                <h2 className="text-text-alt underline text-sm mb-6">
                  Don't have an account? Sign Up
                </h2>
              </a>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} ref={formRef}>
                <div className="flex flex-col gap-4">
                  <TextForm
                    placeholder="Enter your username or email"
                    type="text"
                    value={username}
                    onChange={(value) => setUsername(value)}
                    className="w-full"
                  />
                  <TextForm
                    placeholder="Enter your password"
                    type="password"
                    value={password}
                    onChange={(value) => setPassword(value)}
                    className="w-full"
                  />
                  <a
                    href="#"
                    className="text-right"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        // Handle forgot password action
                      }
                    }}
                  >
                    <h2 className="text-text-alt underline text-sm">
                      Forgot Password
                    </h2>
                  </a>
                  <Button
                    text="Log in"
                    onClick={handleLogin}
                    className="bg-blue-500 text-white py-2 rounded-md w-full"
                    type="submit"
                  />
                </div>
              </form>
            </motion.div>
          )}

          {/* Signup Form Content - Only interactive when visible */}
          {!isLogin && (
            <motion.div
              className="w-4/5 max-w-md p-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <h1 className="font-bold text-3xl mb-2 mt-12">Sign Up</h1>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  toggleForm();
                }}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    toggleForm();
                  }
                }}
              >
                <h2 className="text-text-alt underline text-sm mb-6">
                  Have an account? Log In
                </h2>
              </a>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} ref={formRef}>
                <div className="flex flex-col gap-4">
                  <TextForm
                    placeholder="Enter your username"
                    type="text"
                    value={username}
                    onChange={(value) => setUsername(value)}
                  />
                  <TextForm
                    placeholder="Enter your email"
                    type="email"
                    value={email}
                    onChange={(value) => setEmail(value)}
                  />
                  <TextForm
                    placeholder="Enter your password"
                    type="password"
                    value={password}
                    onChange={(value) => setPassword(value)}
                  />
                  <TextForm
                    placeholder="Confirm password"
                    type="password"
                    value={confirmPassword}
                    onChange={(value) => setConfirmPassword(value)}
                  />
                  <Button
                    text="Sign Up"
                    onClick={handleSignup}
                    className="bg-blue-500 text-white py-2 rounded-md w-full"
                    type="submit"
                  />
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
