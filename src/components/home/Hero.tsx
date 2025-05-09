import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { OnboardingModal } from "@/components/ui/OnboardingModal";

interface OnboardingStep {
  title: string;
  description: string;
  action: () => void;
  estimate: string;
}

const Hero = () => {
  const router = useRouter();
  const [onboardingSteps, setOnboardingSteps] = useState<OnboardingStep[]>([]);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);

  const showOnboardingModalWithSteps = (steps: OnboardingStep[]) => {
    setOnboardingSteps(steps);
    setShowOnboardingModal(true);
  };

  const handleInvest = () => {
    const steps: OnboardingStep[] = [
      {
        title: "Connect Your Wallet",
        description: "Set up a secure digital wallet to manage your investments",
        action: () => router.push("/connect-wallet"),
        estimate: "2-5 minutes"
      },
      {
        title: "Quick Verification",
        description: "Complete a simple KYC process to start investing",
        action: () => router.push("/kyc"),
        estimate: "5-10 minutes"
      },
      {
        title: "Investment Preferences",
        description: "Tell us your investment goals and risk tolerance",
        action: () => router.push("/preferences"),
        estimate: "3-5 minutes"
      },
      {
        title: "Start Investing",
        description: "Browse curated properties and invest with as little as $100",
        action: () => router.push("/marketplace"),
        estimate: "Browse at your pace"
      }
    ];
    
    showOnboardingModalWithSteps(steps);
  };

  const handleList = () => {
    const steps: OnboardingStep[] = [
      {
        title: "Property Owner Verification",
        description: "Verify your identity and property ownership",
        action: () => router.push("/owner-verification"),
        estimate: "10-15 minutes"
      },
      {
        title: "Property Assessment",
        description: "Get a preliminary valuation and tokenization estimate",
        action: () => router.push("/property-assessment"),
        estimate: "15-20 minutes"
      },
      {
        title: "Documentation Upload",
        description: "Upload required property documents and legal paperwork",
        action: () => router.push("/documents"),
        estimate: "20-30 minutes"
      },
      {
        title: "List Your Property",
        description: "Set your tokenization preferences and list your property",
        action: () => router.push("/list"),
        estimate: "10-15 minutes"
      }
    ];

    showOnboardingModalWithSteps(steps);
  };

  return (
    <section className="relative min-h-screen pt-20 flex items-center">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1128] via-[#1a1b3a] to-[#16213e] -z-10" />
      
      {/* Abstract shapes */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-indigo-900/20 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full bg-purple-800/10 blur-3xl" />
        <div className="absolute top-3/4 right-1/4 w-40 h-40 rounded-full bg-cyan-800/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Own Real Estate
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                One Token at a Time
              </span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl">
              The future of property investment through blockchain technology. 
              Buy entire properties or just a fraction - you decide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-white font-medium hover:shadow-lg hover:shadow-indigo-500/20 transition-all"
                onClick={handleInvest}
              >
                Start Investing
              </button>
              <button
                className="px-8 py-4 border border-gray-500 rounded-full text-white font-medium hover:bg-white/5 transition-all"
                onClick={handleList}
              >
                List Your Property
              </button>
            </div>
            
            {/* Onboarding Modal */}
            <OnboardingModal
              open={showOnboardingModal}
              onClose={() => setShowOnboardingModal(false)}
              steps={onboardingSteps}
            />
          </div>

          {/* Tokenization Visualization */}
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-lg p-1">
              <div className="relative w-full h-full overflow-hidden rounded-lg">
                <Image
                  src="/Houses/House1.jpg"
                  alt="Luxury Property"
                  fill
                  className="object-cover"
                  quality={90}
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 to-purple-600/30" />
                
                {/* Grid overlay */}
                <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-1">
                  {Array.from({ length: 64 }, (_, i) => (
                    <div 
                      key={i}
                      className={`border border-cyan-400/30 ${
                        Math.random() > 0.7 ? 'bg-cyan-400/20' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
