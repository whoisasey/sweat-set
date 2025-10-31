import { Add, Remove } from "@mui/icons-material";
import { Box, Card, IconButton, TextField, Typography } from "@mui/material";

import Grid from "@mui/material/Grid2";

interface SetInputsProps {
  sets: number;
  reps: (number | "")[];
  weights: (number | "")[];
  onChange: (index: number, value: string, field: string) => void;
}

export default function SetInputs({ sets, reps, weights, onChange }: SetInputsProps) {
  const handleAdjust = (index: number, field: string, delta: number) => {
    const currentValueStr = field === "rep" ? reps[index] : weights[index];
    const currentValue = Number(currentValueStr) || ""; // empty string treated as 0 for adjustment
    const newValue = Math.max(0, Number(currentValue) + delta);
    onChange(index, newValue.toString(), field);
  };

  return (
    <Card variant="outlined" sx={{ p: 2, mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Set Details
      </Typography>

      {Array.from({ length: sets }, (_, i) => (
        <Grid container spacing={2} key={i} alignItems="center" sx={{ mb: 1 }}>
          {/* Reps */}
          <Grid size={{ xs: 6 }}>
            <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
              Reps
            </Typography>
            <Box display="flex" alignItems="center" sx={{ gap: 1 }}>
              <IconButton size="small" onClick={() => handleAdjust(i, "rep", -1)} aria-label="decrease reps">
                <Remove fontSize="small" />
              </IconButton>
              <TextField
                type="number"
                value={reps[i] ?? ""}
                onChange={(e) => onChange(i, e.target.value, "rep")}
                size="small"
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  style: { textAlign: "center" },
                }}
                // sx={{ minWidth: 60 }}
              />
              <IconButton size="small" onClick={() => handleAdjust(i, "rep", 1)} aria-label="increase reps">
                <Add fontSize="small" />
              </IconButton>
            </Box>
          </Grid>

          {/* Weight */}
          <Grid size={{ xs: 6 }}>
            <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
              Weight (lb)
            </Typography>
            <Box display="flex" alignItems="center" sx={{ gap: 1 }}>
              <IconButton size="small" onClick={() => handleAdjust(i, "weight", -5)} aria-label="decrease weight">
                <Remove fontSize="small" />
              </IconButton>
              <TextField
                type="number"
                value={weights[i] ?? ""}
                onChange={(e) => onChange(i, e.target.value, "weight")}
                size="small"
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  style: { textAlign: "center" },
                }}
                sx={{ minWidth: 60 }}
              />
              <IconButton size="small" onClick={() => handleAdjust(i, "weight", 5)} aria-label="increase weight">
                <Add fontSize="small" />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      ))}
    </Card>
  );
}
