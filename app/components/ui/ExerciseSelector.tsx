import { MenuItem, TextField } from "@mui/material";

import { Exercise } from "@/app/types/ExerciseTypes";

interface ExerciseSelectorProps {
  selectedExercise: string;
  allExercises: Exercise[];
  onChange: (value: string) => void;
}

export default function ExerciseSelector({ selectedExercise, allExercises, onChange }: ExerciseSelectorProps) {
  return (
    <TextField
      select
      label="Exercise"
      value={selectedExercise}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
      size="small"
      margin="normal"
    >
      {allExercises
        .sort((a, b) => a.exerciseName.localeCompare(b.exerciseName))
        .map((exercise) => (
          <MenuItem key={exercise._id} value={exercise.exerciseName}>
            {exercise.exerciseName}
          </MenuItem>
        ))}
      <MenuItem value="Not Listed">Exercise Not Listed ➕</MenuItem>
    </TextField>
  );
}
