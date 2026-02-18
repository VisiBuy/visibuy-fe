import React, { useEffect, useMemo, useState } from "react";

type Step = {
  id: string; // element id to spotlight
  title: string;
  body: string;
  primaryLabel?: string;
  onPrimary?: () => void;
};

const STORAGE_KEY = "visibuy_seen_dashboard_tour_v1";

function getRect(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  return {
    top: r.top + window.scrollY,
    left: r.left + window.scrollX,
    width: r.width,
    height: r.height,
  };
}

export function DashboardTour({
  onCreateVerification,
}: {
  onCreateVerification?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  const steps: Step[] = useMemo(
    () => [
      {
        id: "tour-total-verifications",
        title: "Total Verifications",
        body: "This is the total number of product proofs you’ve created. Each one builds your trust record.",
      },
      {
        id: "tour-active-verifications",
        title: "Active Verifications",
        body: "These are verifications currently in progress (e.g., pending buyer review).",
      },
      {
        id: "tour-trust-score",
        title: "Trust Score",
        body: "Your trust score reflects how reliable your proofs are. Buyers can see this before they pay.",
      },
      {
        id: "tour-create-verification",
        title: "Create Your First Verification",
        body: "Click here to upload proof and generate a verified link to share with your buyer.",
        primaryLabel: "Create Verification",
        onPrimary: onCreateVerification,
      },
    ],
    [onCreateVerification]
  );

  // Show only once (per device/browser)
  useEffect(() => {
    try {
      const seen = localStorage.getItem(STORAGE_KEY);
      if (seen !== "true") setIsOpen(true);
    } catch {
      setIsOpen(false);
    }
  }, []);

  // Update spotlight rect whenever step changes / resize / scroll
  useEffect(() => {
    if (!isOpen) return;

    const update = () => {
      const step = steps[stepIndex];
      const el = document.getElementById(step.id);
      if (!el) return;

      el.scrollIntoView({ behavior: "smooth", block: "center" });

      window.setTimeout(() => {
        const el2 = document.getElementById(step.id) as HTMLElement | null;
        if (!el2) return;
        setTargetRect(getRect(el2));
      }, 200);
    };

    update();

    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, { passive: true });

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update);
    };
  }, [isOpen, stepIndex, steps]);

  const close = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {}
    setIsOpen(false);
  };

  const next = () => {
    if (stepIndex >= steps.length - 1) return close();
    setStepIndex((i) => i + 1);
  };

  const back = () => setStepIndex((i) => Math.max(0, i - 1));

  if (!isOpen || !targetRect) return null;

  const step = steps[stepIndex];

  // Tooltip positioning
  const tooltipWidth = 320;
  const padding = 12;

  let tooltipTop = targetRect.top + targetRect.height + 12;
  let tooltipLeft = targetRect.left;

  const maxLeft = window.scrollX + window.innerWidth - tooltipWidth - padding;
  tooltipLeft = Math.min(Math.max(tooltipLeft, window.scrollX + padding), maxLeft);

  const estimatedTooltipHeight = 170;
  const viewportBottom = window.scrollY + window.innerHeight - padding;
  if (tooltipTop + estimatedTooltipHeight > viewportBottom) {
    tooltipTop = targetRect.top - estimatedTooltipHeight - 12;
  }

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={close} aria-hidden />

      {/* Spotlight border */}
      <div
        className="absolute rounded-card border-2 border-white shadow-card pointer-events-none"
        style={{
          top: targetRect.top,
          left: targetRect.left,
          width: targetRect.width,
          height: targetRect.height,
        }}
      />

      {/* Tooltip */}
      <div
        className="absolute w-[320px] rounded-card bg-neutral-white shadow-card border border-neutral-200 p-card-md"
        style={{ top: tooltipTop, left: tooltipLeft }}
      >
        <div className="flex items-start justify-between gap-space-12">
          <div>
            <div className="font-semibold text-neutral-900">{step.title}</div>
            <div className="mt-space-8 text-sm text-neutral-700">{step.body}</div>
          </div>

          <button
            onClick={close}
            className="text-neutral-500 hover:text-neutral-900 text-sm"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="mt-space-16 flex items-center justify-between">
          <button
            onClick={close}
            className="text-sm text-neutral-600 hover:text-neutral-900"
          >
            Skip
          </button>

          <div className="flex items-center gap-space-8">
            <button
              onClick={back}
              disabled={stepIndex === 0}
              className="text-sm px-3 py-2 rounded-button border border-neutral-200 disabled:opacity-50"
            >
              Back
            </button>

            {step.primaryLabel ? (
              <button
                onClick={() => {
                  step.onPrimary?.();
                  close();
                }}
                className="text-sm px-3 py-2 rounded-button bg-primary-blue text-white"
              >
                {step.primaryLabel}
              </button>
            ) : (
              <button
                onClick={next}
                className="text-sm px-3 py-2 rounded-button bg-primary-blue text-white"
              >
                {stepIndex === steps.length - 1 ? "Finish" : "Next"}
              </button>
            )}
          </div>
        </div>

        <div className="mt-space-12 text-xs text-neutral-500">
          Step {stepIndex + 1} of {steps.length}
        </div>
      </div>
    </div>
  );
}
