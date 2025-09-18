"use client";

import { Box, Button, Card, Typography } from "@mui/material";
import React, { useState } from "react";

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
  exercises: [{ name: "", sets: 3, reps: [10, 10, 10] }], // start with one empty form
};

const ExercisePlan = () => {
  const [todaysPlan, setTodaysPlan] = useState<Day>(() => {
    if (workoutPlan?.length) {
      const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const match = workoutPlan.flatMap((week) => week.days).find((day) => day.date?.trim() === today);

      if (match) return match;
    }

    return { ...emptyDay, date: new Date().toLocaleDateString("en-US") };
  });

  const addExercise = () => {
    const newExercise: Exercise = {
      name: "New Exercise",
      sets: 3,
      reps: [10, 10, 10],
    };

    setTodaysPlan((prev) => ({
      ...prev,
      exercises: [...(prev.exercises ?? []), newExercise],
    }));
  };

  const removeExercise = (idx: number) => {
    setTodaysPlan((prev) => {
      if (!prev.exercises) return prev;

      const updatedExercises = prev.exercises.filter((_, i) => i !== idx);
      return { ...prev, exercises: updatedExercises };
    });
  };

  return (
    <Box sx={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        {todaysPlan?.weekday || "Today"} - {todaysPlan?.type || "Workout"}
      </Typography>

      {todaysPlan.exercises?.map(({ name, reps, sets }, idx) => (
        <Card key={idx} sx={{ mb: 2, p: 2, border: "1px solid #ccc", boxShadow: 0, borderRadius: "8px" }}>
          <ExerciseForm
            id={name || `exercise-${idx}`}
            name={name}
            sets={sets}
            reps={reps}
            onRemove={() => removeExercise(idx)}
          />
        </Card>
      ))}

      <Button variant="outlined" startIcon={<AddIcon />} onClick={addExercise} sx={{ mt: 2 }}>
        Add Exercise
      </Button>
    </Box>
  );
};

export default ExercisePlan;
