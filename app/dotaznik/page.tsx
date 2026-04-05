"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { trackEvent, trackCustomEvent } from "@/lib/fbq";
import { captureUtmParams, getUtmParams } from "@/lib/utm";

const steps = [
  {
    title: "Než začneme, uveďte prosím svoj e-mail. 👇",
    field: "email" as const,
    placeholder: "niekto@priklad.com",
    type: "email",
  },
  {
    title: "Aké je Vaše krstné meno? 👇",
    field: "name" as const,
    placeholder: "Ján",
    type: "text",
  },
  {
    title: "Uveďte Vaše telefónne číslo 👇",
    field: "phone" as const,
    placeholder: "+421 (000) 000-000",
    type: "tel",
  },
];

export default function DotaznikPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
  });

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const canProceed = formData[step.field].trim() !== "";

  const [submitting, setSubmitting] = useState(false);
  const trackedSteps = useRef(new Set<number>());

  // Capture UTM params + fire InitiateCheckout on form load
  useEffect(() => {
    captureUtmParams();
    trackEvent("InitiateCheckout", { content_name: "Dotazník" });
  }, []);

  const handleNext = async () => {
    if (!canProceed || submitting) return;

    if (isLastStep) {
      setSubmitting(true);
      try {
        const utm = getUtmParams();
        const res = await fetch("/api/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, utm }),
        });

        if (!res.ok) {
          throw new Error("Failed to send");
        }

        // Fire Lead conversion — this is what Facebook Ads optimizes for
        trackEvent("Lead", { content_name: "Dotazník", currency: "EUR", value: 0 });

        router.push("/dotaznik-odoslany");
      } catch {
        alert("Nepodarilo sa odoslať formulár. Skúste to prosím znova.");
        setSubmitting(false);
      }
    } else {
      const nextStep = currentStep + 1;
      // Track each step progression once for funnel analysis
      if (!trackedSteps.current.has(nextStep)) {
        trackedSteps.current.add(nextStep);
        trackCustomEvent("FormStep", { step: nextStep + 1, field: steps[nextStep].field });
      }
      setCurrentStep(nextStep);
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleNext();
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#EFE1F9]">
      {/* Content */}
      <div className="flex flex-1 flex-col px-6 pb-24 pt-12 sm:px-12 sm:pt-16">
        <div className="mx-auto w-full max-w-3xl">
          {/* Question Title */}
          <h1 className="mb-8 text-3xl font-extrabold text-text-primary sm:text-4xl lg:text-5xl">
            {step.title}
          </h1>

          {/* Input Area */}
          <div className="rounded-2xl bg-white p-2">
            {step.field === "phone" ? (
              <PhoneInput
                international
                defaultCountry="SK"
                value={formData.phone}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, phone: value || "" }))
                }
                onKeyDown={handleKeyDown}
                className="w-full rounded-xl bg-white px-4 py-3 text-lg text-text-primary outline-none [&>input]:border-none [&>input]:bg-transparent [&>input]:text-lg [&>input]:outline-none"
              />
            ) : (
              <input
                type={step.type}
                placeholder={step.placeholder}
                value={formData[step.field]}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [step.field]: e.target.value,
                  }))
                }
                onKeyDown={handleKeyDown}
                autoFocus
                className="w-full rounded-xl bg-white px-4 py-3 text-lg text-text-primary placeholder-text-muted outline-none"
              />
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#EFE1F9] px-6 py-6">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          {/* Step Indicator */}
          <span className="text-sm text-text-muted">
            Step:{currentStep + 1}/{steps.length}
          </span>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-3">
            {/* Back Button */}
            <button
              onClick={handleBack}
              disabled={isFirstStep}
              className={`flex h-12 w-12 items-center justify-center rounded-full border border-border-light transition-colors ${
                isFirstStep
                  ? "cursor-not-allowed opacity-30"
                  : "hover:bg-gray-100"
              }`}
            >
              <ChevronLeft className="h-5 w-5 text-text-primary" />
            </button>

            {/* Next / Submit Button */}
            <button
              onClick={handleNext}
              disabled={!canProceed || submitting}
              className={`flex items-center gap-2 rounded-full px-8 py-3 text-base font-semibold text-white transition-all ${
                canProceed && !submitting
                  ? "bg-primary hover:scale-105"
                  : "cursor-not-allowed bg-gray-300"
              }`}
            >
              {submitting ? "Odosiela sa..." : isLastStep ? "Odoslať" : "Ďalej"}
              {!isLastStep && <ChevronRight className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
