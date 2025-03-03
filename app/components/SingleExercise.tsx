"use client";

import {
	Box,
	Button,
	IconButton,
	InputLabel,
	TextField,
	Typography,
} from "@mui/material";
import React, { FormEvent, useEffect, useState } from "react";

import { CSS } from "@dnd-kit/utilities";
import DeleteIcon from "@mui/icons-material/Delete";
// import WeightInput from "./ui/Weights";
import { exercises } from "@/app/utils/exerciseList";
import { useSession } from "next-auth/react";
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
	weights: number[],
	handleInputChange: (index: number, value: string, field: string) => void,
	setSets: (value: number) => void,
	setReps: (value: number) => void,
) => {
	// this needs to be loaded after RenderSets, and await the user to select sets
	const renderWeightInput = (
		sets: number,
		handleInputChange: (index: number, value: string, field: string) => void,
	) => (
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
						value={weights[index] || ""} // Fallback to an empty string to avoid undefined
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

	const renderSets = () => {
		return (
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
					onChange={(e) => setSets(Number(e.target.value))}
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
	};

	const renderReps = () => {
		return (
			<Box
				sx={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					gap: 2,
				}}>
				<label htmlFor="reps">Input Reps</label>
				<input
					id="reps"
					type="number"
					placeholder="Sets"
					name="reps"
					value={reps}
					onChange={(e) => setReps(Number(e.target.value))}
					min={1}
					style={{
						width: "10%",
						padding: "8px",
						borderRadius: "4px",
						border: "1px solid #ccc",
					}}
				/>
				<Typography variant="body2" color="textSecondary">
					Reps
				</Typography>
			</Box>
		);
	};

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
			{renderSets()}
			{renderReps()}
			{renderWeightInput(sets, handleInputChange)}
		</>
	);
};

export const ExerciseForm = ({ onRemove, id }: ExerciseProps) => {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const [selectedExercise, setSelectedExercise] = useState(exercises[0].id);
	const [sets, setSets] = useState<number>(1); // Initial sets value
	const [reps, setReps] = useState<number>(1);
	const [weights, setWeights] = useState<number[]>([]); // Start with an empty array
	const [userId, setUserId] = useState<string | undefined>("");
	const session = useSession();

	// Update weights when sets change
	useEffect(() => {
		// If the number of sets changes, update the weights array to match the new number of sets
		setWeights(Array.from({ length: sets }, () => 0) as number[]);
	}, [sets]);

	useEffect(() => {
		setUserId(session?.data?.user?.id);
	}, [session]);

	const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedExercise(event.target.value);
	};

	// Handles  input changes
	const handleInputChange = (index: number, value: string, field?: string) => {
		if (field === "reps") {
			setReps(Number(value) || 1);
		}

		if (field === "sets") {
			// Ensure sets is always at least 1 and update weights if necessary
			const newSets = Math.max(Number(value) || 1, 1); // Set a minimum value of 1 for sets
			setSets(newSets);

			// If the number of sets decreases, trim the weights array
			if (newSets < weights.length) {
				setWeights(weights.slice(0, newSets));
			}
			// If the number of sets increases, expand the weights array
			else if (newSets > weights.length) {
				setWeights((prevWeights) => [
					...prevWeights,
					...new Array(newSets - prevWeights.length).fill(0),
				]);
			}
		} else if (field?.startsWith("weight")) {
			// Update the weights array if the field is related to weight
			const newWeights = [...weights];
			newWeights[index] = Number(value) || 0; // Convert value to number, or 0 if invalid
			setWeights(newWeights);
		}
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.target as HTMLFormElement);
		const data: Record<string, unknown> = {};

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
		data.userId = userId; // Replace with actual user ID logic
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
			// TODO: Handle success
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

				{weightInput(
					selectedExercise,
					sets,
					reps,
					weights,
					handleInputChange,
					setSets,
					setReps,
				)}
				{/* <WeightInput
					selectedExercise={selectedExercise}
					sets={sets}
					reps={10}
					weights={weights}
					handleInputChange={handleInputChange}
					setSets={setSets}
				/> */}
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
