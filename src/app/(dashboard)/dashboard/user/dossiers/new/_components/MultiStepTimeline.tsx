"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import React from "react";

interface Step {
  id: number;
  title: string;
}

interface MultiStepTimelineProps {
  steps: Step[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

export const MultiStepTimeline: React.FC<MultiStepTimelineProps> = ({
  steps,
  currentStep,
  setCurrentStep,
}) => {
  return (
    <div className="flex items-start justify-center p-4">
      {steps.map((step, index) => {
        const isCompleted = step.id < currentStep;
        const isCurrent = step.id === currentStep;
        const isClickable = isCompleted;

        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => isClickable && setCurrentStep(step.id)}
                disabled={!isClickable && !isCurrent}
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 font-bold transition-colors",
                  {
                    "bg-primary border-primary text-primary-foreground": isCompleted,
                    "border-primary text-primary": isCurrent,
                    "border-muted-foreground/30 text-muted-foreground/50": !isCompleted && !isCurrent,
                    "cursor-pointer hover:bg-primary/90 hover:text-primary-foreground": isClickable,
                    "cursor-default": !isClickable,
                  }
                )}
              >
                {isCompleted ? <Check className="h-6 w-6" /> : step.id}
              </button>
              <p className={cn(
                "text-center text-sm w-32",
                {
                  "text-primary font-semibold": isCurrent,
                  "text-muted-foreground": !isCurrent,
                }
                )}
              >
                {step.title}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-auto border-t-2 transition-colors mt-5",
                  {
                    "border-primary": isCompleted || isCurrent,
                    "border-muted-foreground/30": !isCompleted && !isCurrent,
                  }
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
