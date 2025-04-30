import React from "react";
import LoadingSpinner from "./LoadingSpinner";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-colors rounded-md focus:outline-none";

  const variantClasses = {
    primary:
      "bg-[#1c219e] text-white hover:bg-[#141679] focus:ring-2 focus:ring-[#1c219e]/50",
    outline:
      "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-[#1c219e]/50",
    ghost:
      "text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-[#1c219e]/50",
  };

  const sizeClasses = {
    sm: "text-sm px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-5 py-2.5",
  };

  const disabledClasses =
    disabled || isLoading ? "opacity-70 cursor-not-allowed" : "";

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <LoadingSpinner
            size="sm"
            color={variant === "primary" ? "border-white" : "border-[#1c219e]"}
          />
          <span className="ml-2">{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
