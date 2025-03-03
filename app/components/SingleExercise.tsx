"use client";

import { Box, Button, IconButton, InputLabel } from "@mui/material";
import React, { FormEvent, useEffect, useState } from "react";

import { CSS } from "@dnd-kit/utilities";
import DeleteIcon from "@mui/icons-material/Delete";
import WeightInput from "@/app/components/ui/Weights";
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
	const [date, setDate] = useState<Date>(new Date());
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
		}

		if (field === "date") {
			setDate(new Date(value));
		}

		if (field?.startsWith("weight")) {
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
		data.date = date;

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

				<WeightInput
					selectedExercise={selectedExercise}
					sets={sets}
					reps={10}
					weights={weights}
					handleInputChange={handleInputChange}
					setSets={setSets}
					date={date}
				/>
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
