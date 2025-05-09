"use client";

import { useEffect, useState } from "react";

export interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose?: () => void;
}

export default function Toast({ message, type = "info", duration = 2000, onClose }: ToastProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!show) return null;

  let color = "bg-gray-800 border-gray-700 text-white";
  if (type === "success") color = "bg-green-600 border-green-400 text-white";
  if (type === "error") color = "bg-red-600 border-red-400 text-white";
  if (type === "info") color = "bg-blue-600 border-blue-400 text-white";

  return (
    <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-lg border shadow-lg transition-all ${color}`}
      role="alert"
    >
      {message}
    </div>
  );
}
