"use client";

import { Alert, Box, Button, Collapse, IconButton, Snackbar, TextField } from "@mui/material";
import { Exercise, ExerciseProps } from "@/app/types/ExerciseTypes";
import React, { FormEvent, useEffect, useState } from "react";
import { addNewExercise, checkIfExerciseExists, submitExerciseData } from "@/app/utils/helpers-fe";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import DeleteIcon from "@mui/icons-material/Delete";
import ExerciseSelector from "@/app/components/ui/ExerciseSelector";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import NewExerciseInput from "@/app/components/ui/NewExerciseInput";
import SetInputs from "@/app/components/ui/SetInputs";
import { capitalizeWords } from "@/app/utils/helpers";

export const ExerciseForm = ({ onRemove, sets, reps }: ExerciseProps) => {
  const [selectedExercise, setSelectedExercise] = useState("");
  const [updatedSets, setUpdatedSets] = useState(sets || 1);
  const [updatedReps, setUpdatedReps] = useState<number[]>(reps || []);
  const [date, setDate] = useState<Date>(new Date());

  const [weights, setWeights] = useState<(number | string)[]>([]);
  const [newExercise, setNewExercise] = useState("");
  const [isNewExercise, setIsNewExercise] = useState(false);
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [successMsg, setSuccessMsg] = useState("");
  const [showForm, setShowForm] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch exercises
  useEffect(() => {
    const fetchExercises = async () => {
      const response = await fetch("/api/exercise/get");
      if (response.ok) {
        setAllExercises(await response.json());
      }
    };
    fetchExercises();
    setUserId(localStorage.getItem("userId"));
  }, []);

  // Sync weights with sets
  useEffect(() => {
    setWeights(Array.from({ length: updatedSets }, (_, i) => weights[i] ?? ""));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatedSets]);

  const handleChange = (value: string) => {
    setSelectedExercise(value);
    setIsNewExercise(value === "Not Listed");
  };

  const handleInputChange = (index: number, value: string, field: string) => {
    if (field.startsWith("rep")) {
      const newReps = [...updatedReps];
      newReps[index] = Number(value) || 0;
      setUpdatedReps(newReps);
    }
    if (field.startsWith("weight")) {
      const newWeights = [...weights];
      newWeights[index] = value === "" ? "" : value;
      setWeights(newWeights);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      sets: updatedSets,
      reps: updatedReps,
      exerciseId: selectedExercise,
      weights,
      userId: userId!,
      exercise: selectedExercise || newExercise,
      date: date ? new Date(date) : new Date(),
    };

    try {
      if (newExercise) {
        const exists = await checkIfExerciseExists(newExercise);
        if (!exists) await addNewExercise(newExercise);
      }

      await submitExerciseData(data);
      setSuccessMsg("Added Exercise Set 💪🏻");
      setShowForm(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Collapse in={showForm} timeout={1500} onExited={onRemove}>
      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column">
          <ExerciseSelector selectedExercise={selectedExercise} allExercises={allExercises} onChange={handleChange} />

          {isNewExercise && (
            <NewExerciseInput
              value={newExercise}
              onChange={(val) => {
                setNewExercise(capitalizeWords(val));
                setSelectedExercise(val);
              }}
            />
          )}

          <TextField
            label="Sets"
            type="number"
            value={updatedSets}
            onChange={(e) => setUpdatedSets(Math.max(1, Number(e.target.value)))}
            onBlur={() => {
              // Zoom out by scrolling to top of form
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            fullWidth
            size="small"
            margin="normal"
          />

          <SetInputs sets={updatedSets} reps={updatedReps} weights={weights} onChange={handleInputChange} />

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date"
              value={date}
              onChange={() => setDate(new Date())}
              slotProps={{
                textField: { fullWidth: true, size: "small", margin: "normal" },
              }}
            />
          </LocalizationProvider>
        </Box>

        <Box display="flex" justifyContent="space-between" mt={2}>
          <IconButton color="error" onClick={onRemove}>
            <DeleteIcon />
          </IconButton>
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </Box>

        <Snackbar open={!!successMsg} autoHideDuration={4000} onClose={() => setSuccessMsg("")}>
          <Alert severity="success">{successMsg}</Alert>
        </Snackbar>
      </form>
    </Collapse>
  );
};
