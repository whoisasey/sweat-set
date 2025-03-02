import { Box, InputLabel, TextField, Typography } from "@mui/material";

import React from "react";

// Props for SetInput Component
interface SetInputProps {
	sets: number;
	setSets: (value: number) => void;
}

// Component for entering number of sets
const SetInput: React.FC<SetInputProps> = ({ sets, setSets }) => (
	<Box
		sx={{
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			gap: 2,
		}}>
		<label htmlFor="sets">Input Sets</label>
		<input
			id="sets"
			type="number"
			placeholder="Sets"
			name="sets"
			value={sets}
			onChange={(e) => setSets(Math.max(1, Number(e.target.value)))} // Prevents values below 1
			min={1}
			style={{
				width: "10%",
				padding: "8px",
				borderRadius: "4px",
				border: "1px solid #ccc",
			}}
		/>
		<Typography variant="body2" color="textSecondary">
			Sets
		</Typography>
	</Box>
);

// Props for WeightInputs Component
interface WeightInputsProps {
	sets: number;
	weights: number[];
	handleInputChange: (index: number, value: string, field?: string) => void;
}

// Component for entering weights per set
const WeightInputs: React.FC<WeightInputsProps> = ({
	sets,
	weights,
	handleInputChange,
}) => (
	<>
		{Array.from({ length: sets }).map((_, index) => (
			<div key={index}>
				<label htmlFor={`weight-${index}`}>Input Weight</label>
				<input
					id={`weight-${index}`}
					type="number"
					min={50}
					step={5}
					placeholder="Weight"
					name={`weight-${index}`}
					value={weights[index] || ""} // Fallback to empty string to avoid undefined errors
					onChange={(e) => handleInputChange(index, e.target.value)}
					style={{
						width: "100%",
						padding: "8px",
						borderRadius: "4px",
						border: "1px solid #ccc",
					}}
				/>
			</div>
		))}
	</>
);

// Props for WeightInput Component
interface WeightInputProps {
	selectedExercise: string;
	sets: number;
	reps: number;
	weights: number[];
	handleInputChange: (index: number, value: string, field?: string) => void;
	setSets: (value: number) => void;
}

// Parent Component that handles weight and set inputs
const WeightInput: React.FC<WeightInputProps> = ({
	selectedExercise,
	sets,
	reps,
	weights,
	handleInputChange,
	setSets,
}) => {
	if (selectedExercise === "running") {
		return (
			<Box>
				<InputLabel htmlFor="distance">Input KM</InputLabel>
				<TextField
					id="distance"
					type="number"
					placeholder="Distance"
					name="distance"
					required
					variant="outlined"
					fullWidth
				/>
				{" km"}
			</Box>
		);
	}

	return (
		<>
			<SetInput sets={sets} setSets={setSets} />
			<Typography variant="body2" color="textSecondary">
				{reps} reps
			</Typography>
			<WeightInputs
				sets={sets}
				weights={weights}
				handleInputChange={handleInputChange}
			/>
		</>
	);
};

export default WeightInput;
