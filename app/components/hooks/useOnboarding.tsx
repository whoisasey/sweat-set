"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import Cookies from "js-cookie";
import { useSession } from "next-auth/react";

export function useOnboardingTour() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tourRef = useRef<any>(null);
  const [domReady, setDomReady] = useState(false);
  const { status } = useSession();

  const steps = [
    {
      element: ".root",
      title: "Welcome to Sweat Set 👋",
      intro: "Here’s a quick walkthrough to help you get comfy before you start moving.",
    },
    {
      element: ".exercise-plan",
      title: "Plan Your Movement 🏋️‍♀️",
      intro: "Choose your exercises and log your sets as you go. Simple, smooth, and stress-free.",
    },
    {
      element: ".progress",
      title: "Reflect & Grow 📈",
      intro: "Peek at today’s stats or explore your past workouts. Your progress story lives here.",
    },
    {
      element: ".profile",
      title: "Make It Yours ✨",
      intro: "Update your profile and goals anytime. Set things up the way *you* like.",
    },
  ];

  // Wait until DOM is ready
  useEffect(() => {
    const timeout = setTimeout(() => setDomReady(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  // Run once per browser cookie
  useEffect(() => {
    if (!domReady) return;

    const hasSeen = Cookies.get("hasSeenOnboarding");
    if (!hasSeen && status === "authenticated") {
      startTour();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domReady]);

  const startTour = useCallback(async () => {
    if (!domReady) return;

    const { default: introJs } = await import("intro.js");
    await import("intro.js/introjs.css");

    const intro = introJs();
    intro.setOptions({
      steps,
      showProgress: true,
      showButtons: true,
      showBullets: true,
      exitOnEsc: true,
      exitOnOverlayClick: true,
      hidePrev: true,
      nextLabel: "Next",
      prevLabel: "Back",
      doneLabel: "Finish",
    });
    intro.oncomplete(() => finish());
    intro.onexit(() => finish());

    intro.start();
    tourRef.current = intro;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domReady]);

  const finish = () => {
    Cookies.set("hasSeenOnboarding", "true", { expires: 365 }); // expires in 1 year
  };

  return { startTour };
}
