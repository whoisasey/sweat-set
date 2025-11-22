import "intro.js/introjs.css";

import { useEffect, useState } from "react";

import { Steps } from "intro.js-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useOnboardingIntro = (user: any) => {
  const [enabled, setEnabled] = useState(false);

  // console.log("user", user);

  const steps = [
    {
      element: ".exercise-plan",
      intro: "Select an exercise from the dropdown and fill in the sets as you go. Submit when ready!",
    },
    {
      element: ".progress",
      intro: "Check your Progress here",
    },
    {
      element: ".profile",
      intro: "Update your Profile here",
    },
  ];

  // Runs automatically when user logs in
  useEffect(() => {
    if (!user) return;

    if (!user.hasSeenOnboarding) {
      setEnabled(true);
    }
  }, [user]);

  // When the tour ends, update the database
  const finishOnboarding = async () => {
    try {
      await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hasSeenOnboarding: true }),
      });
    } catch (err) {
      console.error("Failed to update onboarding flag", err);
    }
  };

  // Allow manual triggering (optional)
  const start = () => setEnabled(true);

  // Component you render somewhere in your app layout
  const Intro = () => (
    <Steps
      enabled={enabled}
      steps={steps}
      initialStep={0}
      onExit={() => {
        finishOnboarding();
        setEnabled(false);
      }}
      onComplete={() => {
        finishOnboarding();
        setEnabled(false);
      }}
    />
  );

  return { Intro, start, enabled };
};
