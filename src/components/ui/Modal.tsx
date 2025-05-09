"use client";

import { ReactNode } from "react";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-700 p-6 min-w-[320px] max-w-full relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
          aria-label="Close"
        >
          ×
        </button>
        {title && <h2 className="text-xl font-bold text-white mb-4">{title}</h2>}
        {children}
      </div>
    </div>
  );
}
