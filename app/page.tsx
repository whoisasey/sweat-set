"use client";

import { useEffect, useState } from "react";

import ExercisePlan from "@/app/components/ExercisePlan";
import { useOnboardingTour } from "@/app/components/hooks/useOnboarding";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Home() {
  const { status, data } = useSession();
  const user = data?.user;
  const router = useRouter();
  const { startTour } = useOnboardingTour(user);

  const [domReady, setDomReady] = useState(false);

  // 1️⃣ Redirect if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // 2️⃣ Wait until DOM is ready
  useEffect(() => {
    const timer = setTimeout(() => setDomReady(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // 3️⃣ Start onboarding tour
  useEffect(() => {
    if (domReady && status === "authenticated" && user) {
      startTour();
    }
  }, [domReady, status, user, startTour]);

  if (status === "unauthenticated") return null;

  return (
    <div>
      <ExercisePlan user={user?.name} />
    </div>
  );
}
