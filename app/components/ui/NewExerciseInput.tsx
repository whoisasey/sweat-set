import { TextField } from "@mui/material";

interface NewExerciseInputProps {
  value: string;
  onChange: (val: string) => void;
}

export default function NewExerciseInput({ value, onChange }: NewExerciseInputProps) {
  return (
    <TextField
      label="New Exercise"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
      size="small"
      margin="normal"
    />
  );
}
