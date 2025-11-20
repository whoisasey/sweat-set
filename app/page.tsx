"use client";

import ExercisePlan from "@/app/components/ExercisePlan";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const Home = () => {
  const router = useRouter();
  const { status, data } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "unauthenticated") return null; // Prevent premature render

  return <ExercisePlan user={data?.user?.name} />;
};

export default Home;
