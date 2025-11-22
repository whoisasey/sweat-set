"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useOnboardingTour(user: any) {
  const tourRef = useRef<any>(null);
  const [domReady, setDomReady] = useState(false);

  const steps = [
    {
      element: ".exercise-plan",
      title: "Your Exercise Plan",
      intro: "Select an exercise from the dropdown and track your sets here.",
    },
    {
      element: ".progress",
      title: "Your Progress",
      intro: "This is where you'll see your progress over time.",
    },
    {
      element: ".profile",
      title: "Your Profile",
      intro: "Edit your profile and goals here.",
    },
  ];

  // Wait until DOM is ready
  useEffect(() => {
    const timeout = setTimeout(() => setDomReady(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  // Auto-run onboarding once per user
  useEffect(() => {
    if (!domReady || !user) return;

    if (!user.hasSeenOnboarding) {
      startTour();
    }
  }, [domReady, user]);

  const startTour = useCallback(async () => {
    if (!domReady) return;

    // 1️⃣ Dynamically import Intro.js only in the browser
    const { default: introJs } = await import("intro.js");
    await import("intro.js/introjs.css"); // optional CSS

    // 2️⃣ Create tour instance
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

    // 3️⃣ Event handlers
    intro.oncomplete(() => finish());
    intro.onexit(() => finish());

    // 4️⃣ Start the tour
    intro.start();
    tourRef.current = intro;
  }, [domReady]);

  // Mark onboarding as seen
  const finish = async () => {
    try {
      await fetch("/api/user/onboarding", { method: "POST" });
    } catch (err) {
      console.error("Failed to update onboarding:", err);
    }
  };

  return { startTour };
}
