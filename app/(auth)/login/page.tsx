"use client";
import TextForm from "@/components/UI/TextForm";
import Button from "@/components/UI/Button";
import React, { useState, useRef } from "react";
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
  const [loading, setLoading] = useState(false);

  // Refs for form submission
  const formRef = useRef(null);

  const handleLogin = async () => {
    // Reset error
    setError("");
    setLoading(true);

    try {
      // Simple validation
      if (!email) {
        setError("Email is required");
        setLoading(false);
        return;
      }

      if (!password) {
        setError("Password is required");
        setLoading(false);
        return;
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to home after successful login
      router.push("/");
    } catch (err: any) {
      setError("Failed to login");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    // Reset error
    setError("");
    setLoading(true);

    try {
      // Validation
      if (!username) {
        setError("Username is required");
        setLoading(false);
        return;
      }

      if (!email) {
        setError("Email is required");
        setLoading(false);
        return;
      }

      if (!validateEmail(email)) {
        setError("Please enter a valid email address");
        setLoading(false);
        return;
      }

      if (!password) {
        setError("Password is required");
        setLoading(false);
        return;
      }

      if (password.length < 8) {
        setError("Password must be at least 8 characters");
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to home after successful signup
      router.push("/");
    } catch (err: any) {
      setError("Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      handleLogin();
    } else {
      handleSignup();
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    // Clear form fields and errors when switching
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
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
                    placeholder="Enter your email"
                    type="email"
                    value={email}
                    onChange={(value) => setEmail(value)}
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
                    href="/forgot-password"
                    className="text-left"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        router.push("/forgot-password");
                      }
                    }}
                  >
                    <h2 className="text-text-alt underline text-sm">
                      Forgot Password
                    </h2>
                  </a>
                  <Button
                    text={loading ? "Logging in..." : "Log in"}
                    onClick={handleLogin}
                    className="bg-blue-500 text-white py-2 rounded-md w-full"
                    type="submit"
                    disabled={loading}
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
                    text={loading ? "Signing up..." : "Sign Up"}
                    onClick={handleSignup}
                    className="bg-blue-500 text-white py-2 rounded-md w-full"
                    type="submit"
                    disabled={loading}
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
