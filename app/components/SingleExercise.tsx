"use client";

import {
	Box,
	IconButton,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	TextField,
	Typography,
} from "@mui/material";
import React, { useState } from "react";

import { CSS } from "@dnd-kit/utilities";
import DeleteIcon from "@mui/icons-material/Delete";
import { exercises } from "@/app/utils/exerciseList";
// import { DragEndEvent } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";

// Exercise Component
export interface ExerciseProps {
	name?: string;
	sets: number;
	reps: number;
	onRemove: () => void;
	id: string;
}

export const ExerciseForm = ({ sets, reps, onRemove, id }: ExerciseProps) => {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id });
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};
	const [selectedExercise, setSelectedExercise] = useState(exercises[0].id);

	const handleChange = (event: SelectChangeEvent<string>) => {
		const value = event.target.value;
		setSelectedExercise(value);
		console.log("Selected Exercise:", value); // Logs the selected value
	};

	return (
		<form>
			<Box
				ref={setNodeRef}
				style={style}
				{...attributes}
				{...listeners}
				sx={{
					display: "flex",
					flexDirection: "column",
					// justifyContent: "space-between",
					// alignItems: "center",
					p: 2,
					mb: 1,
					border: "1px solid #ccc",
					borderRadius: "8px",
				}}>
				{"single exercise"}
				<InputLabel htmlFor="exercise">Exercise</InputLabel>
				<Select
					value={selectedExercise}
					onChange={(e) => handleChange(e)}
					id="exercise"
					name="exercise">
					{exercises.map((exercise) => (
						<MenuItem key={exercise.id} value={exercise.id}>
							{exercise.name}
						</MenuItem>
					))}
				</Select>
				<Typography variant="body2" color="textSecondary">
					{sets} sets x {reps} {selectedExercise !== "Running" ? "reps" : "km"}
				</Typography>
				{selectedExercise !== "Running" && (
					<>
						<InputLabel>Input Weight</InputLabel>
						<TextField
							type="number"
							placeholder="Weight"
							name="weight"
							required
						/>
					</>
				)}
			</Box>
			<IconButton color="error" onClick={onRemove}>
				<DeleteIcon />
			</IconButton>
		</form>
	);
};
