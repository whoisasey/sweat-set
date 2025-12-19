"use client";

import { Box, Button, Card, Typography } from "@mui/material";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import AddIcon from "@mui/icons-material/Add";
import { ExerciseForm } from "./ExerciseForm";
import { useOnboardingTour } from "@/app/components/hooks/useOnboarding";
import { workoutPlan } from "@/app/data/workoutPlan";

type Exercise = {
  id: string;
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
  exercises: [{ id: uuidv4(), name: "", sets: 3, reps: [10, 10, 10] }], // start with one empty form
};

const ExercisePlan = ({ user }: { user?: string }) => {
  useOnboardingTour(); // Hook handles tour automatically

  const [todaysPlan, setTodaysPlan] = useState<Day>(() => {
    if (workoutPlan?.length) {
      const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const match = workoutPlan.flatMap((week) => week.days).find((day) => day.date?.trim() === today);

      if (match) {
        // Ensure all exercises have unique IDs
        const exercisesWithIds = match.exercises?.map((exercise) => ({
          ...exercise,
          id: uuidv4(),
        }));
        return { ...match, exercises: exercisesWithIds };
      }
    }

    return { ...emptyDay, date: new Date().toLocaleDateString("en-US") };
  });

  const addExercise = () => {
    const newExercise: Exercise = {
      id: uuidv4(),
      name: "New Exercise",
      sets: 3,
      reps: [10, 10, 10],
    };

    setTodaysPlan((prev) => ({
      ...prev,
      exercises: [...(prev.exercises ?? []), newExercise],
    }));
  };

  const removeExercise = (id: string) => {
    setTodaysPlan((prev) => {
      if (!prev.exercises) return prev;

      const updatedExercises = prev.exercises.filter((exercise) => exercise.id !== id);
      return { ...prev, exercises: updatedExercises };
    });
  };

  return (
    <Box sx={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        Welcome back, {user}!
      </Typography>

      {todaysPlan.exercises?.map(({ id, name, reps, sets }) => (
        <Card key={id} sx={{ mb: 2, p: 2, border: "1px solid #ccc", boxShadow: 0, borderRadius: "8px" }}>
          <ExerciseForm
            id={id}
            name={name}
            sets={sets}
            reps={reps}
            onRemove={() => removeExercise(id)}
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
