"use client";
import TextForm from "@/components/UI/TextForm";
import Button from "@/components/UI/Button";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import supabase from "@/lib/supabaseClient";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Ref for form submission
  const formRef = useRef(null);

  // Check if the user is authenticated via the reset password link
  useEffect(() => {
    const checkAuthSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        // If there's an active session, the user likely came here via a reset link
        if (data.session) {
          setIsAuthenticated(true);
        } else {
          setError(
            "Invalid or expired password reset link. Please request a new one."
          );
        }
      } catch (err: any) {
        console.error("Error checking session:", err);
        setError(
          "Failed to validate your session. Please request a new reset link."
        );
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuthSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
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

    setIsLoading(true);

    try {
      // Update the user's password via Supabase
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        throw new Error(error.message);
      }

      setSuccessMessage("Password has been reset successfully.");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        try {
          router.push("/login");
        } catch (routerError) {
          console.log("Router navigation error:", routerError);
          // Fallback navigation
          window.location.href = "/login";
        }
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
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

      {/* White Panel */}
      <div className="absolute right-0 h-full w-1/2 bg-white">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Logo */}
          <div className="absolute top-4 right-4">
            <Image
              src="/zephyr-logo.svg"
              width={56}
              height={56}
              alt="Zephyr Logo"
            />
          </div>

          {/* Form Content */}
          <motion.div
            className="w-4/5 max-w-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="font-bold text-3xl mb-2 mt-12">Reset Password</h1>
            <a
              href="/login"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  router.push("/login");
                }
              }}
            >
              <h2 className="text-text-alt underline text-sm mb-6">
                Back to Login
              </h2>
            </a>

            {checkingAuth && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <span className="ml-3">Verifying your session...</span>
              </div>
            )}

            {!checkingAuth && (
              <>
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                    {error}
                  </div>
                )}

                {successMessage && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
                    {successMessage}
                  </div>
                )}

                {isAuthenticated && !successMessage && (
                  <form onSubmit={handleSubmit} ref={formRef}>
                    <div className="flex flex-col gap-4">
                      <TextForm
                        placeholder="Enter new password"
                        type="password"
                        value={password}
                        onChange={(value) => setPassword(value)}
                        className="w-full"
                      />
                      <TextForm
                        placeholder="Confirm new password"
                        type="password"
                        value={confirmPassword}
                        onChange={(value) => setConfirmPassword(value)}
                        className="w-full"
                      />
                      <Button
                        text={isLoading ? "Resetting..." : "Reset Password"}
                        onClick={() => {}}
                        className="bg-blue-500 text-white py-2 rounded-md w-full"
                        type="submit"
                        disabled={isLoading}
                      />
                    </div>
                  </form>
                )}

                {(!isAuthenticated || error) && (
                  <div className="flex flex-col gap-4 mt-4">
                    <p className="text-gray-700 mb-2">
                      {!isAuthenticated
                        ? "Your reset link appears to be invalid or expired."
                        : "Having trouble resetting your password?"}
                    </p>
                    <Button
                      text="Request New Reset Link"
                      onClick={() => {
                        try {
                          router.push("/forgot-password");
                        } catch (routerError) {
                          console.log("Router navigation error:", routerError);
                          window.location.href = "/forgot-password";
                        }
                      }}
                      className="bg-blue-500 text-white py-2 rounded-md w-full"
                    />
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
