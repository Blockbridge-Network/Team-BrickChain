// src/components/profile/KycForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setKycCompleted, getCurrentUser, submitKycDocument } from "@/lib/user";
import { upload } from "thirdweb/storage";
import Toast from "../ui/Toast";
import { FileUploader, FileWithIpfs } from "../listing/steps/FileUploader";
import { useClient } from "../../app/client";

const ID_TYPES = [
  "Driver's License",
  "National ID",
  "Passport",
  "Government Issued ID",
];

interface KycStatus {
  status: 'NOT_STARTED' | 'PENDING' | 'APPROVED';
  message?: string;
}

async function checkPendingKyc(id: string): Promise<boolean> {
  try {
    // Fetch user's KYC submissions from your backend
    const response = await fetch(`/api/kyc/status/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch KYC status');
    }
    
    const data = await response.json();
    // Return true if there's a pending submission
    return data.status === 'PENDING';
  } catch (error) {
    console.error('Error checking KYC status:', error);
    return false;
  }
}
function checkPendingKyc(id: string) {
  throw new Error("Function not implemented.");
}

