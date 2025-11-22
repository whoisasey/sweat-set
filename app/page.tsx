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
  const { startTour } = useOnboardingTour();

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

  // Start tour when DOM is ready
  useEffect(() => {
    if (domReady) startTour();
  }, [domReady, startTour]);

  if (status === "unauthenticated") return null;

  return (
    <div className="root">
      <ExercisePlan user={user?.name} />
    </div>
  );
}
