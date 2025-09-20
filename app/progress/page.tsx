"use client";

import { Box, Divider, List, ListItemText, Skeleton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

import Charts from "../components/ui/Charts";
import InsightsIcon from "@mui/icons-material/Insights";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export type ProcessedWorkoutData = {
  exercise: string;
  data: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [x: string]: any;
    date: Date;
    avgWeight: number;
  }[];
};

const ProgressPage = () => {
  const { status } = useSession();

  const [exerciseHistory, setExerciseHistory] = useState<ProcessedWorkoutData[]>([]);
  const [viewState, setViewState] = useState(false); // false = Today, true = All Time
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  // const userId =

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
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
  }, [userId, viewState, status]);

  if (status === "unauthenticated") {
    router.push("/login");
  }

  const handleViewChange = (state: boolean) => setViewState(state);

  const RenderViewState: React.FC<{ exerciseHistory: ProcessedWorkoutData[]; viewState: boolean }> = ({
    exerciseHistory,
    viewState,
  }) => {
    // false view state (today)
    if (!viewState) {
      return (
        <>
          {/* --- Minimal Journal --- */}

          <Typography variant="h6" gutterBottom>
            Today’s Workout Log
          </Typography>
          <List>
            {exerciseHistory.map((exercise, idx) => {
              const sets = exercise.data[0].sets
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .map((s: { weight: any; reps: any }) => `${s.weight}×${s.reps}`)
                .join(", ");
              return (
                <div key={idx}>
                  <List>
                    <ListItemText primary={exercise.exercise} secondary={sets} />
                  </List>
                  {idx < exerciseHistory.length - 1 && <Divider />}
                </div>
              );
            })}
          </List>
          <Charts exerciseHistory={exerciseHistory} viewState={viewState} />
        </>
      );
    }
    // true view state (all)
    if (viewState) {
      return <Charts exerciseHistory={exerciseHistory} viewState={viewState} />;
    }
  };
  return (
    <Box
      sx={{
        margin: "1rem auto",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Typography variant="h2" sx={{ textAlign: "center" }} mb={4}>
        Progress <InsightsIcon />
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
        <RenderViewState exerciseHistory={exerciseHistory} viewState={viewState} />
      )}
    </Box>
  );
};

export default ProgressPage;
