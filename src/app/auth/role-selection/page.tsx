"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

export default function RoleSelectionPage() {
  const router = useRouter();
  const { updateRole } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRoleSelection = async (role: "PROPERTY_OWNER" | "INVESTOR") => {
    setIsLoading(true);
    setError("");

    try {
      await updateRole(role);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "An error occurred while setting your role");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-4xl p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">Choose your role</h1>
          <p className="mt-4 text-xl text-muted-foreground">
            How would you like to participate in BrickEarn?
          </p>
        </div>

        {error && (
          <div className="p-3 rounded bg-destructive/15 text-destructive text-sm mb-8 text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <button
            onClick={() => handleRoleSelection("PROPERTY_OWNER")}
            disabled={isLoading}
            className="group relative bg-card hover:bg-accent p-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out"
          >
            <div className="aspect-video relative mb-6 rounded-lg overflow-hidden">
              <Image
                src="/images/property-owner.jpg"
                alt="Property Owner"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-2xl font-bold mb-4">Property Owner</h3>
            <p className="text-muted-foreground">
              List your properties for tokenization and manage your real estate assets
              on the blockchain.
            </p>
          </button>

          <button
            onClick={() => handleRoleSelection("INVESTOR")}
            disabled={isLoading}
            className="group relative bg-card hover:bg-accent p-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out"
          >
            <div className="aspect-video relative mb-6 rounded-lg overflow-hidden">
              <Image
                src="/images/investor.jpg"
                alt="Investor"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-2xl font-bold mb-4">Investor</h3>
            <p className="text-muted-foreground">
              Invest in tokenized real estate properties and build your
              digital real estate portfolio.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
