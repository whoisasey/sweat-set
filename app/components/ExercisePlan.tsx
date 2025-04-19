"use client";

import { Box, Button, Card, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import { ExerciseForm } from "./SingleExercise";
import { workoutPlan } from "@/app/data/workoutPlan";

type Exercise = {
  name: string;
  sets: number;
  reps: number[];
};

type Day = {
  weekday: string;
  date: string;
  type: string;
  exercises?: Exercise[];
};

const emptyDay: Day = {
  weekday: "",
  date: "",
  type: "",
  exercises: [],
};

const ExercisePlan = () => {
  const [todaysPlan, setTodaysPlan] = useState<Day | typeof emptyDay>(emptyDay);

  useEffect(() => {
    const today = process.env.NODE_ENV === "development" ? new Date("2025-04-19T04:00:00.000Z") : new Date();

    // Replace with `new Date()` in production
    const formattedToday = today.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const match = workoutPlan.flatMap((week) => week.days).find((day) => day.date?.trim() === formattedToday);

    if (match) {
      setTodaysPlan(match);
    } else {
      // Ensure `emptyDay` has a string `date`, not a Date object
      setTodaysPlan({
        ...emptyDay,
        date: formattedToday,
      });
    }
  }, []);

  const addExercise = () => {
    const newExercise = {
      name: "New Exercise",
      sets: 3,
      reps: [10, 10, 10],
    };

    setTodaysPlan((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        exercises: [...(prev.exercises ?? []), newExercise],
      };
    });
  };

  const removeExercise = (idx: number) => {
    setTodaysPlan((prev) => {
      if (!prev || !prev.exercises) return prev;

      const updatedExercises = prev.exercises.filter((_, i) => i !== idx);
      return {
        ...prev,
        exercises: updatedExercises,
      };
    });
  };

  // TODO later: add exercise to the workout plan if its a recovery day
  return (
    <Box sx={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <Typography variant="h5" fontWeight="bold">
        {todaysPlan?.weekday} - {todaysPlan?.type}
      </Typography>

      {todaysPlan?.exercises?.map(({ name, reps, sets }, idx) => {
        return (
          <Card
            key={idx}
            sx={{
              mb: 2,
              p: 2,
              my: 2,
              border: "1px solid #ccc",
              boxShadow: 0,
              borderRadius: "8px",
            }}
          >
            <ExerciseForm
              key={name}
              id={name}
              name={name}
              sets={sets}
              reps={reps}
              onRemove={() => removeExercise(idx)}
            />
          </Card>
        );
      })}
      <Button variant="outlined" startIcon={<AddIcon />} onClick={() => addExercise()} sx={{ mt: 2 }}>
        Add Set
      </Button>
    </Box>
  );
};

export default ExercisePlan;
