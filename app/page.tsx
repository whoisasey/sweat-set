"use client";

import { useEffect } from "react";

import ExercisePlan from "@/app/components/ExercisePlan";
import { useOnboardingTour } from "@/app/components/hooks/useOnboarding";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Home() {
  const { status, data } = useSession();
  const user = data?.user;
  const router = useRouter();
  useOnboardingTour(); // Hook handles tour automatically

  // 1️⃣ Redirect if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "unauthenticated") return null;

  return (
    <div className="root">
      <ExercisePlan user={user?.name} />
    </div>
  );
}
