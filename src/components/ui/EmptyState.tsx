import React, { ReactNode } from "react";
import Button from "./Button";

interface EmptyStateProps {
  message: string;
  buttonText?: string;
  onButtonClick?: () => void;
  icon?: ReactNode;
}

export default function EmptyState({
  message,
  buttonText,
  onButtonClick,
  icon,
}: EmptyStateProps) {
  return (
    <div className="text-center py-20 bg-white rounded-lg shadow-sm">
      {icon && <div className="mb-4">{icon}</div>}
      <p className="text-gray-700 mb-4 font-medium">{message}</p>
      {buttonText && onButtonClick && (
        <Button
          onClick={onButtonClick}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          {buttonText}
        </Button>
      )}
    </div>
  );
}
