"use client";

import ExercisePlan from "@/app/components/ExercisePlan";
import { useEffect } from "react";
import { useOnboardingIntro } from "@/app/components/hooks/useOnboarding";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const Home = () => {
  const router = useRouter();
  const { status, data } = useSession();
  const user = data?.user;
  const { Intro } = useOnboardingIntro(user);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "unauthenticated") return null; // Prevent premature render

  return (
    <>
      <Intro />
      <ExercisePlan user={data?.user?.name} />;
    </>
  );
};

export default Home;
