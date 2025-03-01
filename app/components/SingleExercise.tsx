"use client";

import {
	Box,
	IconButton,
	InputLabel,
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
const weightInput = (selectedExercise: string, sets: number, reps: number) => {
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
			<Typography variant="body2" color="textSecondary">
				{sets} sets x {reps} reps
			</Typography>
			<Box>
				<InputLabel htmlFor="weight">Input Weight</InputLabel>
				<TextField
					id="weight"
					type="number"
					placeholder="Weight"
					name="weight"
					required
					variant="outlined"
					fullWidth
				/>
			</Box>
		</>
	);
};

export const ExerciseForm = ({ sets, reps, onRemove, id }: ExerciseProps) => {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id });
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};
	const [selectedExercise, setSelectedExercise] = useState(exercises[0].id);

	const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const value = event.target.value;
		setSelectedExercise(value);
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
					p: 2,
					mb: 1,
					border: "1px solid #ccc",
					borderRadius: "8px",
				}}>
				{"single exercise"}
				<InputLabel htmlFor="exercise">Exercise</InputLabel>
				<select
					name="exercise"
					id="exercise"
					onChange={(e) =>
						handleChange(e as React.ChangeEvent<HTMLSelectElement>)
					}>
					{exercises.map((exercise) => (
						<option key={exercise.id} value={exercise.id}>
							{exercise.name}
						</option>
					))}
				</select>
				{/* <Select
					value={selectedExercise}
					onChange={() => console.log("clicked exercise...")}
					id="exercise"
					name="exercise">
					{exercises.map((exercise) => (
						<MenuItem key={exercise.id} value={exercise.id}>
							{exercise.name}
						</MenuItem>
					))}
				</Select> */}

				{weightInput(selectedExercise, sets, reps)}
			</Box>
			<IconButton color="error" onClick={onRemove}>
				<DeleteIcon />
			</IconButton>
		</form>
	);
};
