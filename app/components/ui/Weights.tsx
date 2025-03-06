"use client";

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
			pattern="[0-9]*"
			value={sets}
			onChange={(e) => setSets(Math.max(1, Number(e.target.value)))} // Prevents values below 1
			className="sets_input"
			style={{
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
					pattern="[0-9]*"
					step={5}
					placeholder="Weight"
					name={`weight-${index}`}
					value={weights[index] || ""} // Fallback to empty string to avoid undefined errors
					onChange={(e) =>
						handleInputChange(
							index,
							(e.target as HTMLInputElement).value,
							`weight-${index}`,
						)
					}
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
interface DateInputProps {
	date: Date;
	handleInputChange: (index: number, value: string, field?: string) => void;
}

// Component for entering date
const DateInput: React.FC<DateInputProps> = ({ handleInputChange, date }) => {
	return (
		<>
			<label htmlFor="date">{"Today's Date"}</label>
			<input
				type="date"
				name="date"
				id="date"
				value={date.toISOString().split("T")[0]}
				onChange={(e) =>
					handleInputChange(0, (e.target as HTMLInputElement).value, "date")
				}
			/>
		</>
	);
};

// Props for WeightInput Component
interface WeightInputProps {
	selectedExercise: string;
	sets: number;
	reps: number;
	weights: number[];
	date: Date;
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
	date,
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
			<DateInput handleInputChange={handleInputChange} date={date} />
		</>
	);
};

export default WeightInput;
