import { Card, TextField, Typography } from "@mui/material";

import Grid from "@mui/material/Grid2";

interface SetInputsProps {
  sets: number;
  reps: number[];
  weights: number[];
  onChange: (index: number, value: string, field: string) => void;
}

export default function SetInputs({ sets, reps, weights, onChange }: SetInputsProps) {
  return (
    <Card variant="outlined" sx={{ p: 2, mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Set Details
      </Typography>

      {Array.from({ length: sets }, (_, i) => (
        <Grid container spacing={2} key={i} sx={{ mb: 1 }}>
          <Grid size={{ xs: 4 }}>
            <TextField
              label="Reps"
              type="number"
              value={reps[i] ?? ""}
              onChange={(e) => onChange(i, e.target.value, "rep")}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 4 }}>
            <TextField
              label="Weight (lb)"
              type="number"
              value={weights[i] ?? ""}
              onChange={(e) => onChange(i, e.target.value, "weight")}
              fullWidth
              size="small"
            />
          </Grid>
        </Grid>
      ))}
    </Card>
  );
}
