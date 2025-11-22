"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import Cookies from "js-cookie";

export function useOnboardingTour() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tourRef = useRef<any>(null);
  const [domReady, setDomReady] = useState(false);

  const steps = [
    {
      element: ".root",
      title: "Welcome!",
      intro: "Here's a quick tour of Sweat Set!",
    },
    {
      element: ".exercise-plan",
      title: "Your Exercise Plan",
      intro: "Select an exercise from the dropdown and track your sets here.",
    },
    {
      element: ".progress",
      title: "Your Progress",
      intro:
        "This is where you'll see your progress over time. Toggle through Today's Workout stats or historical data.",
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

  // Run once per browser cookie
  useEffect(() => {
    if (!domReady) return;

    const hasSeen = Cookies.get("hasSeenOnboarding");
    if (!hasSeen) {
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
