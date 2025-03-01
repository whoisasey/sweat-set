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

const weightInput = (selectedExercise: string, sets: number, reps: number) => {
	const renderSets = (sets: number) => (
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
			{renderSets(sets)}
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
		setSelectedExercise(event.target.value);
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Collect input values dynamically
		const formData = new FormData(e.target as HTMLFormElement);
		const data: Record<string, any> = {};

		formData.forEach((value, key) => {
			data[key] = value;
		});

		// Convert necessary fields to numbers
		data.sets = sets;
		data.reps = reps;
		data.exerciseId = selectedExercise;
		data.distance =
			selectedExercise === "running" ? Number(data.distance) || 0 : 0;

		// Convert weight fields into an array
		data.weights = Object.keys(data)
			.filter((key) => key.startsWith("weight-"))
			.map((key) => Number(data[key]) || 0);

		// Remove individual weight inputs from the main object
		Object.keys(data).forEach((key) => {
			if (key.startsWith("weight-")) {
				delete data[key];
			}
		});

		// Add user ID & date (adjust based on actual implementation)
		data.userId = "123"; // Replace with actual user ID logic
		data.date = new Date().toISOString(); // Default to current date

		try {
			const response = await fetch("/api/singleexercise/add", {
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

				{weightInput(selectedExercise, sets, reps)}
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
