"use client";

import { Box, InputLabel, TextField, Typography } from "@mui/material";

import React from "react";
import { capitalizeWords } from "@/app/utils/helpers";
import { useWindowSize } from "@/app/utils/helpers-fe";

// Props for SetInput Component
interface SetInputProps {
	sets: number | undefined;
	setUpdatedSets: (value: number) => void;
}

// Component for entering number of sets
const SetInput: React.FC<SetInputProps> = ({ sets, setUpdatedSets }) => (
	<Box
		sx={{
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			gap: 2,
		}}>
		<label htmlFor="sets" hidden>
			Sets
		</label>
		<input
			id="sets"
			inputMode="numeric"
			pattern="\d*"
			type="number"
			step={1}
			min={0}
			placeholder="Sets"
			name="sets"
			value={sets}
			onChange={(e) => setUpdatedSets(Math.max(0, Number(e.target.value)))} // Prevents values below 1
			className="sets_input"
			style={{
				padding: "8px",
				borderRadius: "4px",
				border: "1px solid #ccc",
				fontSize: "16px",
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
	reps: number[] | number;
	updatedReps?: number[] | number;
	weights: number[];
	handleInputChange: (index: number, value: string, field?: string) => void;
}
// Component for entering weights per set
const WeightInputs: React.FC<WeightInputsProps> = ({
	sets,
	reps,
	weights,
	handleInputChange,
}) => {
	const windowWidth = useWindowSize("width");

	const renderInputs = (
		state: number | number[],
		input: string,
		index: number,
		width: string,
	) => (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				width: `${
					windowWidth && windowWidth < 540 ? "calc(50% - 32px)" : width
				}`,
			}}>
			<label htmlFor={`${input}-${index}`}>{`${capitalizeWords(
				input,
			)}s`}</label>
			<input
				id={`${input}-${index}`}
				inputMode="decimal"
				type="number"
				step={input === "weight" ? 0.5 : 1}
				min={0}
				value={
					input === "rep"
						? Array.isArray(state)
							? Number(state[index]).toString() // Ensure reps is a string
							: state
						: undefined
				} // Ensure reps is a string or fallback to "0"
				name={`${input}-${index}`}
				onChange={(e) =>
					handleInputChange(
						index,
						(e.target as HTMLInputElement).value,
						`${input}-${index}`,
					)
				}
				style={{
					padding: "8px",
					borderRadius: "4px",
					border: "1px solid #ccc",
					fontSize: "16px",
				}}
			/>
		</Box>
	);

	return (
		<>
			{Array.from({ length: sets }).map((_, index) => (
				<Box key={index} sx={{ display: "flex" }} gap={4}>
					{renderInputs(weights, "weight", index, "60%")}
					{renderInputs(reps, "rep", index, "auto")}
				</Box>
			))}
		</>
	);
};
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
	sets?: number | string;
	updatedSets?: number;
	updatedReps?: number[] | number;
	weights: number[];
	date: Date;
	handleInputChange: (index: number, value: string, field?: string) => void;
	setUpdatedSets: (value: number) => void;
	setUpdatedReps: (value: number[]) => void;
}

// Parent Component that handles weight and set inputs
const WeightInput: React.FC<WeightInputProps> = ({
	selectedExercise,
	updatedSets,
	weights,
	handleInputChange,
	setUpdatedSets,
	updatedReps,
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
			<SetInput
				sets={
					typeof updatedSets === "string" ? Number(updatedSets) : updatedSets
				}
				setUpdatedSets={setUpdatedSets}
			/>
			<WeightInputs
				sets={Number(updatedSets)}
				reps={
					Array.isArray(updatedReps) || typeof updatedReps === "number"
						? updatedReps
						: []
				}
				weights={weights}
				handleInputChange={handleInputChange}
			/>
			<DateInput handleInputChange={handleInputChange} date={date} />
		</>
	);
};

export default WeightInput;
