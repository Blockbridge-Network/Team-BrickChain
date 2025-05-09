// src/components/ui/KycPrompt.tsx
"use client";
import Modal from "./Modal";
import Link from "next/link";

export default function KycPrompt({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Complete KYC Required">
      <div className="space-y-4">
        <p className="text-gray-300">
          To continue, you must complete your KYC (Know Your Customer) verification. This is required for investing or listing properties.
        </p>
        <Link
          href="/profile"
          className="block w-full text-center py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition"
          onClick={onClose}
        >
          Go to Profile & Complete KYC
        </Link>
      </div>
    </Modal>
  );
}
