"use client";
import TextForm from "@/components/UI/TextForm";
import Button from "@/components/UI/Button";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Ref for form submission
  const formRef = useRef(null);

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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccessMessage("Password has been reset successfully.");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError("Something went wrong. Please try again.");
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

            {!successMessage && (
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

            {error && (
              <div className="flex flex-col gap-4 mt-4">
                <Button
                  text="Request New Reset Link"
                  onClick={() => router.push("/forgot-password")}
                  className="bg-blue-500 text-white py-2 rounded-md w-full"
                />
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
