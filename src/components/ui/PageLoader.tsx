"use client";
import Spinner from "./Spinner";

export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
      <Spinner className="h-12 w-12" />
    </div>
  );
}
