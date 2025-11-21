"use client";

import ExercisePlan from "@/app/components/ExercisePlan";
import { Steps } from "intro.js-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const steps = [
  {
    element: ".exercise-plan",
    intro: "Select an exercise from the dropdown and fill in the sets as you go. Submit when ready",
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

const Home = () => {
  const router = useRouter();
  const { status, data } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "unauthenticated") return null; // Prevent premature render

  return (
    <>
      <Steps enabled steps={steps} initialStep={0} onExit={() => {}} />
      <ExercisePlan user={data?.user?.name} />;
    </>
  );
};

export default Home;
