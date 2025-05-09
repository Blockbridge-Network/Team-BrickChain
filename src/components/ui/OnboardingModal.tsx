'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';
import { Button } from '@/components/ui/button';
import { Timer, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

interface OnboardingStep {
  title: string;
  description: string;
  action: () => void;
  estimate: string;
}

interface OnboardingModalProps {
  open: boolean;
  onClose: () => void;
  steps: OnboardingStep[];
}

export function OnboardingModal({ open, onClose, steps = [] }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  
  // Safety check - if no steps provided, don't render
  if (!steps.length) {
    return null;
  }

  const currentStepData = steps[currentStep];

  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      currentStepData?.action?.();
      onClose();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    const lastStep = steps[steps.length - 1];
    if (lastStep?.action) {
      lastStep.action();
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>      <DialogContent className="sm:max-w-[500px] bg-[#0a1128] border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            {currentStepData.title}
          </DialogTitle>
        </DialogHeader>
        
        {/* Progress bar */}
        <div className="relative h-2 bg-gray-800 rounded-full mt-4">
          <div 
            className="absolute h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
        
        {/* Step count */}
        <div className="text-sm text-gray-400 mt-2">
          Step {currentStep + 1} of {steps.length}
        </div>

        {/* Step content */}
        <div className="my-6 space-y-4">
          <p className="text-gray-300">
            {currentStepData.description}
          </p>
          
          {/* Time estimate */}
          <div className="flex items-center gap-2 px-4 py-3 bg-gray-800/50 rounded-lg">
            <Timer className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-gray-300">
              Estimated time: {currentStepData.estimate}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-between mt-6">
          <div className="flex gap-3">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            )}
            <Button
              variant="outline"
              onClick={handleSkip}
              className="text-gray-400 hover:text-white"
            >
              Skip tutorial
            </Button>
          </div>
          <Button
            onClick={handleNext}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center gap-2"
          >
            {currentStep === steps.length - 1 ? (
              <>
                Get Started
                <CheckCircle className="w-4 h-4" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
