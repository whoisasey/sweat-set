"use client";

import { Box, Button, IconButton, InputLabel } from "@mui/material";
import React, { FormEvent, useEffect, useState } from "react";
import { capitalizeWords, formatDate } from "@/app/utils/helpers";

import { CSS } from "@dnd-kit/utilities";
import DeleteIcon from "@mui/icons-material/Delete";
import { ProcessedWorkoutData } from "@/app/progress/page";
import WeightInput from "@/app/components/ui/Weights";
import { exercises } from "@/app/utils/exerciseList";
import { useSession } from "next-auth/react";
// import { DragEndEvent } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";

// Exercise Component
export interface ExerciseProps {
	name?: string;
	sets: number;
	reps: number[];
	onRemove: () => void;
	id: string;
}

type Exercise = {
	_id: string;
	exerciseName: string;
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
	const [reps, setReps] = useState<number[]>([]); //start with an empty array
	const [date, setDate] = useState<Date>(new Date());
	const [weights, setWeights] = useState<number[]>([]); // Start with an empty array
	const [newExercise, setNewExercise] = useState<string>("");
	const [userId, setUserId] = useState<string | undefined>("");
	const [isNewExercise, setIsNewExercise] = useState(false);
	const [allExercises, setAllExercises] = useState<Exercise[]>([]);
	const [successMsg, setSuccessMsg] = useState<string>("");
	const [exerciseHistory, setExerciseHistory] = useState<
		ProcessedWorkoutData[]
	>([]);
	const session = useSession();

	useEffect(() => {
		const fetchExercises = async () => {
			try {
				const response = await fetch("/api/exercise/get");
				if (!response.ok) {
					throw new Error("Failed to fetch exercises");
				}

				const data: Exercise[] = await response.json();
				setAllExercises(data);
			} catch (err) {
				if (err instanceof Error) {
					console.log(err.message);
				} else {
					throw new Error("An unexpected Error occurred");
				}
			}
		};

		fetchExercises();
	}, []);

	// Update weights when sets change
	useEffect(() => {
		// If the number of sets changes, update the weights array to match the new number of sets
		setWeights(Array.from({ length: sets }, () => 0) as number[]);
	}, [sets]);

	useEffect(() => {
		setUserId(session?.data?.user?.id);
	}, [session]);

	useEffect(() => {
		// when user selects exercise, get the most recent data object
		// set success message

		const getHistory = async () => {
			try {
				const response = await fetch(`/api/exerciseHistory?user=${userId}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});
				if (!response.ok) {
					throw new Error("Failed to fetch exercises");
				}
				const data = await response.json();

				setExerciseHistory(data);
			} catch (error) {
				console.log(error);
			}
		};
		getHistory();

		// console.log(exerciseHistory);

		const findMostRecent = () => {
			// find exercise based on selectedExercise
			const exercise = exerciseHistory.find(
				({ exercise }) => exercise === selectedExercise,
			);
			if (!exercise) return null;

			const today = formatDate();

			// find the most recent entry: on or before today
			const mostRecentEntry = exercise.data

				.filter((entry) => formatDate(entry.date) <= today) // Keep only dates on or before today
				.sort(
					(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
				)[0]; // Sort and pick the latest
			console.log("mostRecentEntry", mostRecentEntry);
		};

		findMostRecent();
		// console.log(selectedExercise, getLatestData);
	}, [selectedExercise, userId]);

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		if (e.target.value === "Not Listed") {
			setIsNewExercise(true);
		}

		setSelectedExercise(e.target.value);
	};

	// Handles  input changes
	const handleInputChange = (index: number, value: string, field?: string) => {
		// Convert input value to a number, default to 1 if invalid (except for weights)
		const numValue = Number(value) || 1;

		switch (field) {
			case "sets": {
				// Ensure sets is always at least 1
				const newSets = Math.max(numValue, 1);
				setSets(newSets);

				// Adjust the weights array length based on the new number of sets
				setWeights(
					(prevWeights) =>
						newSets > prevWeights.length
							? [...prevWeights, ...Array(newSets - prevWeights.length).fill(0)] // Expand with zeros
							: prevWeights.slice(0, newSets), // Trim excess weights
				);
				return;
			}

			case "date":
				// Convert the input value to a Date object
				setDate(new Date(value));
				return;

			case "newExercise":
				setNewExercise(capitalizeWords(value));
				setSelectedExercise(value);
				return;

			default:
				// Handle weight input fields dynamically
				if (field?.startsWith("weight")) {
					setWeights((prevWeights) => {
						const newWeights = [...prevWeights];
						newWeights[index] = Number(value) || 0; // Ensure weight defaults to 0 if invalid
						return newWeights;
					});
				}
				if (field?.startsWith("rep")) {
					setReps((prevReps) => {
						const newReps = [...prevReps];
						newReps[index] = Number(value) || 0; // Ensure weight defaults to 0 if invalid
						return newReps;
					});
				}
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
		data.exercise = selectedExercise ?? newExercise;

		// only run this if newExercise has a value
		if (newExercise !== "") {
			try {
				const checkResponse = await fetch(
					`/api/exercise/check?name=${newExercise}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
						},
					},
				);

				if (!checkResponse.ok) {
					throw new Error("Failed to check if exercise exists");
				}

				const checkResult = await checkResponse.json();

				if (!checkResult.exists) {
					const addResponse = await fetch("/api/exercise/add", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ exerciseName: newExercise }),
					});

					if (!addResponse.ok) {
						throw new Error("Failed to add new exercise");
					}

					// const addResult = await addResponse.json();
				} else {
					console.log("Exercise already exists!");
				}
			} catch (error) {
				console.error("Error submitting exercise:", error);
			}
		}

		try {
			const response = await fetch("/api/exerciseSet/add", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error("Failed to submit exercise data.");
			}
			setSuccessMsg("Added Exercise Set 💪🏻");
			// const result = await response.json();
			// console.log("Success :", result);
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
				<Box>
					<select
						name="exercise"
						id="exercise"
						style={{ width: "100%" }}
						onChange={(e) =>
							handleChange(e as React.ChangeEvent<HTMLSelectElement>)
						}>
						{(!allExercises || allExercises.length === 0) && (
							<option value=""></option>
						)}
						{allExercises
							.sort((a, b) => a.exerciseName.localeCompare(b.exerciseName))
							.map((exercise) => (
								<option key={exercise._id} value={exercise.exerciseName}>
									{exercise.exerciseName}
								</option>
							))}
						{allExercises && allExercises.length >= 0 && (
							<option value="Not Listed">Exercise Not Listed ➕</option>
						)}
					</select>
				</Box>
				{isNewExercise ? (
					<Box sx={{ display: "flex", flexDirection: "column" }}>
						<label htmlFor="newExercise">Input New Exercise</label>
						<input
							type="text"
							name="newExercise"
							id="newExercise"
							value={newExercise}
							onChange={(e) =>
								handleInputChange(
									0,
									(e.target as HTMLInputElement).value,
									"newExercise",
								)
							}
						/>
					</Box>
				) : null}

				<WeightInput
					selectedExercise={selectedExercise}
					sets={sets}
					reps={reps}
					setReps={setReps}
					weights={weights}
					handleInputChange={handleInputChange}
					setSets={setSets}
					date={date}
				/>
			</Box>
			<IconButton color="error" onClick={onRemove}>
				<DeleteIcon />
			</IconButton>
			<p>{successMsg}</p>
			<Button type="submit" variant="contained" color="primary">
				Submit
			</Button>
		</form>
	);
};
