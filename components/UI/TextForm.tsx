"use client";
import React, { useState, useRef, forwardRef, useEffect } from "react";
import { motion } from "framer-motion";

interface TextFormProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  type: string;
}

const TextForm = forwardRef<HTMLInputElement, TextFormProps>(
  (
    { placeholder = "", value: externalValue, onChange, className = "", type },
    ref
  ) => {
    // Use internal state only when component is uncontrolled
    const [internalValue, setInternalValue] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    // Determine if we're using controlled or uncontrolled behavior
    const isControlled = externalValue !== undefined;
    const value = isControlled ? externalValue : internalValue;

    const inputRef = useRef<HTMLInputElement>(null);
    const combinedRef = (node: HTMLInputElement) => {
      inputRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    // Effect to check for autofill and set initial value state
    useEffect(() => {
      // Set hasValue based on current value
      setHasValue(!!value);

      // Special handling for autofill
      const checkAutofill = () => {
        if (inputRef.current) {
          // Check computed background color - autofilled inputs have a different background
          const bgColor = window.getComputedStyle(
            inputRef.current
          ).backgroundColor;
          const isAutofilled =
            bgColor !== "rgba(0, 0, 0, 0)" && bgColor !== "transparent";

          if (isAutofilled || inputRef.current.value) {
            setHasValue(true);
          }
        }
      };

      // Run checks
      checkAutofill();

      // Add delay to check after browser might have applied autofill
      const timeoutId = setTimeout(checkAutofill, 100);
      const intervalId = setInterval(checkAutofill, 1000); // Periodically check

      // Add event listener for animation start (happens with autofill in some browsers)
      const handleAnimationStart = (e: AnimationEvent) => {
        if (e.animationName.includes("autofill")) {
          setHasValue(true);
        }
      };

      inputRef.current?.addEventListener(
        "animationstart",
        handleAnimationStart as any
      );

      // Clean up
      return () => {
        clearTimeout(timeoutId);
        clearInterval(intervalId);
        inputRef.current?.removeEventListener(
          "animationstart",
          handleAnimationStart as any
        );
      };
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (!isControlled) {
        setInternalValue(newValue);
      }
      setHasValue(!!newValue);
      onChange?.(newValue);
    };

    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleBlur = () => {
      setIsFocused(false);
    };

    // Add CSS to detect autofill
    const autofillStyle = `
      input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus {
        transition-delay: 9999s;
        transition-property: background-color, color;
      }
      
      @keyframes onAutoFillStart {
        from { content: ""; }
        to { content: ""; }
      }
      
      @keyframes onAutoFillCancel {
        from { content: ""; }
        to { content: ""; }
      }
      
      input:-webkit-autofill {
        animation-name: onAutoFillStart;
      }
      
      input:not(:-webkit-autofill) {
        animation-name: onAutoFillCancel;
      }
    `;

    return (
      <>
        <style>{autofillStyle}</style>
        <input
          id={`input-field-${placeholder}`}
          ref={combinedRef}
          type={type}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={hasValue ? "" : placeholder}
          className={`h-12 border-2 ${
            isFocused ? "border-primary" : "border-text-alt/50"
          } rounded-lg px-3 outline-none bg-transparent w-full ${className}`}
          tabIndex={0}
          // Add input event listener for autofill detection
          onInput={(e) => setHasValue(!!e.currentTarget.value)}
        />
      </>
    );
  }
);

TextForm.displayName = "TextForm";

export default TextForm;
