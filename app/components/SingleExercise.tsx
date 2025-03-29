"use client";

import { Box, Button, IconButton, InputLabel } from "@mui/material";
import React, { FormEvent, useEffect, useState } from "react";

// import { CSS } from "@dnd-kit/utilities";
import DeleteIcon from "@mui/icons-material/Delete";
import { Exercise } from "@/app/types/ExerciseTypes";
import { ExerciseProps } from "@/app/types/ExerciseTypes";
import WeightInput from "@/app/components/ui/Weights";
import { capitalizeWords } from "@/app/utils/helpers";
import { exercises } from "@/app/utils/exerciseList";
import { useSession } from "next-auth/react";

// import { DragEndEvent } from "@dnd-kit/core";
// import { useSortable } from "@dnd-kit/sortable";

export const ExerciseForm = ({ onRemove, name, sets, reps }: ExerciseProps) => {
	const [selectedExercise, setSelectedExercise] = useState(exercises[0].id);
	const [updatedSets, setUpdatedSets] = useState<number>(0); // Initial sets value
	const [updatedReps, setUpdatedReps] = useState<number[]>([]); //start with an empty array
	const [date, setDate] = useState<Date>(new Date());
	const [weights, setWeights] = useState<number[]>([]); // Start with an empty array
	const [newExercise, setNewExercise] = useState<string>("");
	const [userId, setUserId] = useState<string | undefined>("");
	const [isNewExercise, setIsNewExercise] = useState(false);
	const [allExercises, setAllExercises] = useState<Exercise[]>([]);
	const [successMsg, setSuccessMsg] = useState<string>("");
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

	useEffect(() => {
		setUpdatedSets(sets as number);
		setUpdatedReps(reps as number[]);
	}, [updatedSets, sets, reps]);

	// Update weights when sets change
	useEffect(() => {
		// If the number of sets changes, update the weights array to match the new number of sets
		setWeights(Array.from({ length: updatedSets }, () => 0) as number[]);
	}, [updatedSets]);

	useEffect(() => {
		setUserId(session?.data?.user?.id);
	}, [session]);

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement> | string) => {
		const newValue = typeof e === "string" ? e : e.target.value;

		// Only update if the value has changed
		if (newValue !== selectedExercise) {
			setSelectedExercise(newValue);
		}

		if (newValue === "Not Listed") {
			setIsNewExercise(true);
		}
	};

	useEffect(() => {
		if (name) handleChange(name);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [name]);

	useEffect(() => {
		if (reps) handleInputChange(0, reps, "rep");
		// console.log(reps);
	}, [reps]);

	// Handles  input changes
	const handleInputChange = (
		index: number,
		value: string | number[],
		field?: string,
	) => {
		// Convert input value to a number, default to 1 if invalid (except for weights)
		const numValue = Number(value) || 1;

		const stringVal = typeof value === "string" ? value : "";
		switch (field) {
			case "sets": {
				// Ensure sets is always at least 1
				const newSets = Math.max(numValue, 1);
				setUpdatedSets(newSets);

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
				setDate(new Date(stringVal));
				return;

			case "newExercise":
				setNewExercise(capitalizeWords(stringVal));
				setSelectedExercise(stringVal);
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
					const newValue = Number(value) || 0; // Ensure weight defaults to 0 if invalid

					setUpdatedReps((prevReps) => {
						const newReps = [...prevReps];

						newReps[index] = newValue || 0; // Ensure weight defaults to 0 if invalid
						console.log(newReps);

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
		data.reps = updatedReps;
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
				sx={{
					display: "flex",
					flexDirection: "column",
					p: 2,
					my: 2,
					border: "1px solid #ccc",
					borderRadius: "8px",
				}}>
				<InputLabel htmlFor="exercise">Exercise</InputLabel>
				<Box>
					<select
						name="exercise"
						id="exercise"
						value={selectedExercise}
						style={{
							width: "100%",
							padding: "8px",
							borderRadius: "4px",
							border: "1px solid #ccc",
							fontSize: "16px",
						}}
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
							style={{
								padding: "8px",
								borderRadius: "4px",
								border: "1px solid #ccc",
								fontSize: "16px",
							}}
						/>
					</Box>
				) : null}

				<WeightInput
					selectedExercise={selectedExercise}
					sets={sets}
					updatedSets={updatedSets}
					updatedReps={updatedReps}
					setUpdatedReps={setUpdatedReps}
					weights={weights}
					handleInputChange={handleInputChange}
					setUpdatedSets={setUpdatedSets}
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
