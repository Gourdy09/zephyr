"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

interface ButtonProps {
  text?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  width?: string;
  height?: string;
  fontSize?: string;
  bgColor?: string;
  textColor?: string;
  hoverColor?: string;
  activeColor?: string;
  className?: string;
  iconPosition?: "left" | "right";
  iconSpacing?: string;
  children?: React.ReactNode;
  delay?: number; // Delay in milliseconds
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

function Button({
  text,
  icon,
  onClick,
  width = "100%",
  height,
  fontSize = "16px",
  bgColor = "bg-blue-500",
  textColor = "text-white",
  hoverColor = "bg-blue-600",
  activeColor = "bg-blue-700",
  className = "",
  iconPosition = "left",
  iconSpacing = "2",
  children,
  delay = 150,
  disabled = false,
  type = "button",
}: ButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  // Render button content based on what's provided
  const renderContent = () => {
    // If children are provided, use them directly
    if (children) {
      return children;
    }

    // If both icon and text are provided
    if (icon && text) {
      return iconPosition === "left" ? (
        <>
          <span className={`inline-block mr-${iconSpacing}`}>{icon}</span>
          <span>{text}</span>
        </>
      ) : (
        <>
          <span>{text}</span>
          <span className={`inline-block ml-${iconSpacing}`}>{icon}</span>
        </>
      );
    }

    // If only icon is provided
    if (icon) {
      return icon;
    }

    // Default to text or "Button" if nothing else is provided
    return text || "Button";
  };

  const handleClick = (e: any) => {
    if (!onClick || disabled) return;

    setIsPressed(true);

    // Use setTimeout to delay the onClick execution
    setTimeout(() => {
      onClick();
      setIsPressed(false);
    }, delay);
  };

  return (
    <motion.button
      className={`${
        isPressed ? activeColor : bgColor
      } cursor-pointer ${textColor} font-medium rounded-lg px-4 py-3 flex items-center justify-center ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={handleClick}
      onMouseDown={() => !disabled && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      tabIndex={0}
      type={type}
      style={{
        width,
        height,
        fontSize,
      }}
      // Framer Motion props
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
      }}
      disabled={disabled}
    >
      {renderContent()}
    </motion.button>
  );
}

export default Button;
