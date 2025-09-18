"use client";

import { Box, Skeleton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

import Charts from "../components/ui/Charts";
import InsightsIcon from "@mui/icons-material/Insights";
import { useSession } from "next-auth/react";

export type ProcessedWorkoutData = {
  exercise: string;
  data: { date: Date; avgWeight: number }[];
};

const ProgressPage = () => {
  const { data: session, status } = useSession();

  const [exerciseHistory, setExerciseHistory] = useState<ProcessedWorkoutData[]>([]);
  const [viewState, setViewState] = useState(false); // false = Today, true = All Time
  const [loading, setLoading] = useState(false);

  const userId = session?.user?.id;
  console.log(userId);

  useEffect(() => {
    if (status !== "authenticated" || !userId) return;

    const getHistory = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/exerciseHistory?user=${userId}&today=${!viewState}`, {
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Failed to fetch exercises");
        const data = await response.json();
        setExerciseHistory(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getHistory();
    // console.log("use effect", userId);
  }, [userId, viewState, status]);

  const handleViewChange = (state: boolean) => setViewState(state);

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

      {/* Toggle between Today / All Time */}
      <Box sx={{ display: "flex", justifyContent: "space-evenly" }} mb={6}>
        <Typography
          variant="h5"
          onClick={() => handleViewChange(false)}
          sx={{
            fontWeight: !viewState ? "bold" : "normal",
            cursor: "pointer",
          }}
        >
          Today
        </Typography>
        <Typography
          variant="h5"
          onClick={() => handleViewChange(true)}
          sx={{
            fontWeight: viewState ? "bold" : "normal",
            cursor: "pointer",
          }}
        >
          All Time
        </Typography>
      </Box>

      {/* Handle loading / empty / chart states */}
      {loading ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Skeleton variant="text" width="40%" sx={{ mx: "auto" }} />
          <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
        </Box>
      ) : exerciseHistory.length === 0 ? (
        <Typography textAlign="center">{viewState ? "No workouts yet." : "No workouts logged today."}</Typography>
      ) : (
        <Charts exerciseHistory={exerciseHistory} viewState={viewState} />
      )}
    </Box>
  );
};

export default ProgressPage;
