"use client";
import TextForm from "@/components/UI/TextForm";
import Button from "@/components/UI/Button";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import supabase from "@/lib/supabaseClient";

export default function Page() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  // Form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginIdentifier, setLoginIdentifier] = useState(""); // This will store either email or username

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
      if (!loginIdentifier) {
        setError("Email or username is required");
        setLoading(false);
        return;
      }

      if (!password) {
        setError("Password is required");
        setLoading(false);
        return;
      }

      // Determine if the identifier is an email or username
      const isEmail = loginIdentifier.includes("@");

      console.log(
        `Attempting login with ${isEmail ? "email" : "username"}:`,
        loginIdentifier
      );

      let authData, authError;

      if (isEmail) {
        // Login with email
        ({ data: authData, error: authError } =
          await supabase.auth.signInWithPassword({
            email: loginIdentifier,
            password,
          }));
      } else {
        // Login with username - First find the user with this username
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("email")
          .eq("username", loginIdentifier)
          .single();

        if (userError || !userData) {
          console.error("Error finding user by username:", userError);
          setError("Username not found");
          setLoading(false);
          return;
        }

        // Now login with the found email
        ({ data: authData, error: authError } =
          await supabase.auth.signInWithPassword({
            email: userData.email,
            password,
          }));
      }

      if (authError) {
        console.error("Auth error during login:", authError);
        setError(authError.message || "Invalid login credentials");
        setLoading(false);
        return;
      }

      if (!authData?.user) {
        setError("User not found");
        setLoading(false);
        return;
      }

      console.log("Auth successful, user ID:", authData.user.id);

      // Fetch the user data from users table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("auth_uid", authData.user.id)
        .single();

      console.log("User profile fetch result:", { userData, userError });

      if (userError || !userData) {
        console.error("Error fetching user data:", userError);

        // Sign out the user since we can't find their profile
        await supabase.auth.signOut();

        setError("User profile not found. Please sign up first.");
        setLoading(false);
        return;
      }

      console.log("Login successful, user data:", userData);

      // Store user data in local storage
      localStorage.setItem("user", JSON.stringify(userData));

      // Redirect to home after successful login
      try {
        router.push("/");
      } catch (routerError) {
        console.log("Router navigation error:", routerError);
        // The login was still successful, so we can just ignore this error
        window.location.href = "/"; // Fallback navigation method
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        `Failed to login: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
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

      // Check if username already exists
      const { data: existingUser, error: usernameCheckError } = await supabase
        .from("users")
        .select("username")
        .eq("username", username)
        .single();

      if (existingUser) {
        setError("Username already taken");
        setLoading(false);
        return;
      }

      console.log("Starting signup process...");

      // First create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username, // Store username in auth.users metadata too
          },
        },
      });

      console.log("Auth signup response:", authData, authError);

      if (authError) {
        console.error("Auth error:", authError);
        setError(authError.message || "Error creating account");
        return;
      }

      if (!authData?.user) {
        setError("Failed to create user");
        return;
      }

      console.log("Auth user created successfully:", authData.user.id);

      // Create user profile in public.users table
      const userData = {
        auth_uid: authData.user.id,
        username: username,
        email: email, // Store email in public.users table as requested
      };

      console.log("Attempting to insert user profile:", userData);

      // Insert into public.users table
      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .insert([userData])
        .select();

      console.log("Profile creation response:", { profileData, profileError });

      if (profileError) {
        console.error("Error creating user profile:", profileError);
        console.error("Error details:", JSON.stringify(profileError, null, 2));

        // Clean up the auth user that was created
        await supabase.auth.signOut();

        setError(
          `Failed to create profile: ${profileError.message || "Unknown error"}`
        );
        return;
      }

      console.log("User profile created successfully:", profileData);

      // Store user data in local storage for app use
      if (profileData && profileData[0]) {
        localStorage.setItem("user", JSON.stringify(profileData[0]));
      }

      // Redirect to home after successful signup
      try {
        router.push("/");
      } catch (routerError) {
        console.log("Router navigation error:", routerError);
        // The signup was still successful, so we can just ignore this error
        window.location.href = "/"; // Fallback navigation method
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError(
        `Failed to sign up: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
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
    setLoginIdentifier("");
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
                    placeholder="Enter your email or username"
                    type="text"
                    value={loginIdentifier}
                    onChange={(value) => setLoginIdentifier(value)}
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
