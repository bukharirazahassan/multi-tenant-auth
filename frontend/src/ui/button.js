import React from "react";

export function Button({ children, variant = "primary", onClick }) {
  const styles = variant === "outline"
    ? "border-2 border-gray-300 text-gray-700"
    : "bg-blue-600 text-white";

  return (
    <button
      className={`px-4 py-2 rounded-full font-medium ${styles}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
