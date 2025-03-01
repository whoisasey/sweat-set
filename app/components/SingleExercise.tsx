"use client";

import {
	Box,
	Button,
	IconButton,
	InputLabel,
	TextField,
	Typography,
} from "@mui/material";
import React, { FormEvent, useState } from "react";

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

const weightInput = (
	selectedExercise: string,
	sets: number,
	reps: number,
	handleWeightChange: (index: number, value: string) => void,
) => {
	const renderSets = (
		sets: number,
		handleWeightChange: (index: number, value: string) => void,
	) => (
		<>
			{Array.from({ length: sets }).map((_, index) => (
				<Box key={index}>
					<InputLabel htmlFor={`weight-${index}`}>Input Weight</InputLabel>
					<TextField
						id={`weight-${index}`}
						type="number"
						placeholder="Weight"
						name={`weight-${index}`}
						required
						variant="outlined"
						fullWidth
						onChange={(e) => handleWeightChange(index, e.target.value)}
					/>
				</Box>
			))}
		</>
	);

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
			{renderSets(sets, handleWeightChange)}
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
	const [weights, setWeights] = useState<number[]>(Array(sets).fill(0)); // Initialize state with the number of sets

	const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedExercise(event.target.value);
	};

	// Handles weight input changes
	const handleWeightChange = (index: number, value: string) => {
		const newWeights = [...weights];
		newWeights[index] = Number(value) || 0;
		setWeights(newWeights);
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.target as HTMLFormElement);
		const data: Record<string, any> = {};

		formData.forEach((value, key) => {
			data[key] = value;
		});

		// Add form data
		data.sets = sets;
		data.reps = reps;
		data.exerciseId = selectedExercise;
		data.weights = weights;
		data.distance =
			selectedExercise === "running" ? Number(data.distance) || 0 : 0;
		data.userId = "123"; // Replace with actual user ID logic
		data.date = new Date().toISOString();

		try {
			const response = await fetch("/api/singleExercise/add", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error("Failed to submit exercise data.");
			}

			const result = await response.json();
			console.log("Success:", result);
		} catch (error) {
			console.error("Error submitting exercise:", error);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
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

				{weightInput(selectedExercise, sets, reps, handleWeightChange)}
			</Box>
			<IconButton color="error" onClick={onRemove}>
				<DeleteIcon />
			</IconButton>
			<Button type="submit" variant="contained" color="primary">
				Submit
			</Button>
		</form>
	);
};
