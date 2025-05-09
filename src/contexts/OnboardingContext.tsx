'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface OnboardingContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isComplete: boolean;
  markComplete: () => void;
  reset: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}

interface OnboardingProviderProps {
  children: ReactNode;
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const markComplete = () => {
    setIsComplete(true);
  };

  const reset = () => {
    setCurrentStep(0);
    setIsComplete(false);
  };

  return (
    <OnboardingContext.Provider 
      value={{
        currentStep,
        setCurrentStep,
        isComplete,
        markComplete,
        reset,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}