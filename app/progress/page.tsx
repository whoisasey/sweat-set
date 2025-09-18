"use client";

import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

import Charts from "../components/ui/Charts";
import InsightsIcon from "@mui/icons-material/Insights";
import { useSession } from "next-auth/react";

export type ProcessedWorkoutData = {
  exercise: string;
  data: { date: Date; avgWeight: number }[];
};

const ProgressPage = () => {
  const [userId, setUserId] = useState<string>("");
  const [exerciseHistory, setExerciseHistory] = useState<ProcessedWorkoutData[]>([]);
  const [viewState, setViewState] = useState(false);
  const session = useSession();

  useEffect(() => {
    setUserId(session?.data?.user.id ?? "");
  }, [session]);

  useEffect(() => {
    // 1 - if user logged in, gets UserId from session
    // passes userId into fetch request params to exerciseHistory
    // get all history for user only

    const getHistory = async () => {
      try {
        const response = await fetch(`/api/exerciseHistory?user=${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch exercises");
        }
        const data = await response.json();
        setExerciseHistory(data);
      } catch (error) {
        console.log(error);
      }
    };
    getHistory();
  }, [userId]);

  const handleViewChange = (state: boolean) => {
    // when true, All Time progress will show
    setViewState(state);
  };

  return (
    <Box
      sx={{
        margin: "0 auto",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Typography variant="h2" sx={{ textAlign: "center" }} mb={4}>
        Workout Progress <InsightsIcon />
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-evenly" }} mb={6}>
        <Typography
          variant="h5"
          onClick={() => handleViewChange(false)}
          sx={{
            fontWeight: `${!viewState ? "bold" : "normal"}`,
          }}
        >
          Today{" "}
        </Typography>
        <Typography
          variant="h5"
          onClick={() => handleViewChange(true)}
          sx={{ fontWeight: `${viewState ? "bold" : "normal"}` }}
        >
          All Time{" "}
        </Typography>
      </Box>
      <Charts exerciseHistory={exerciseHistory} viewState={viewState} />
    </Box>
  );
};

export default ProgressPage;
