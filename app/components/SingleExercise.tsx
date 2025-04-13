"use client";

import { Box, Button, IconButton, InputLabel } from "@mui/material";
import React, { FormEvent, useEffect, useState } from "react";
import {
	addNewExercise,
	checkExerciseExists,
	fetchExercises,
	submitExerciseSet,
} from "@/app/utils/helpers";

import DeleteIcon from "@mui/icons-material/Delete";
import { Exercise } from "@/app/types/ExerciseTypes";
import { ExerciseProps } from "@/app/types/ExerciseTypes";
import WeightInput from "@/app/components/ui/Weights";
import { capitalizeWords } from "@/app/utils/helpers";
import { useSession } from "next-auth/react";

export const ExerciseForm = ({ onRemove, name, sets, reps }: ExerciseProps) => {
	const [selectedExercise, setSelectedExercise] = useState("");
	const [updatedSets, setUpdatedSets] = useState(sets ?? 0);
	const [updatedReps, setUpdatedReps] = useState<number[]>([]);
	const [weights, setWeights] = useState<number[]>([]);
	const [date, setDate] = useState(new Date());
	const [newExercise, setNewExercise] = useState("");
	const [isNewExercise, setIsNewExercise] = useState(false);
	const [userId, setUserId] = useState<string | undefined>();
	const [allExercises, setAllExercises] = useState<Exercise[]>([]);
	const [successMsg, setSuccessMsg] = useState("");
	const session = useSession();

	// Set user ID from session
	useEffect(() => {
		if (session?.data?.user?.id) setUserId(session.data.user.id);
	}, [session]);

	// Fetch all exercises
	useEffect(() => {
		const getAllExercises = async () => {
			try {
				const exercises = await fetchExercises();
				setAllExercises(exercises);
			} catch (error) {
				console.error("Error fetching exercises:", error);
			}
		};
		getAllExercises();
	}, []);

	// Sync initial props
	useEffect(() => {
		if (reps) setUpdatedReps(reps);
		if (sets) setUpdatedSets(sets);
	}, [reps, sets]);

	useEffect(() => {
		setWeights(Array(updatedSets).fill(0));
	}, [updatedSets]);

	useEffect(() => {
		if (name) handleChange(name);
	}, [name]);

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement> | string) => {
		const value = typeof e === "string" ? e : e.target.value;
		if (value !== selectedExercise) setSelectedExercise(value);
		setIsNewExercise(value === "Not Listed");
	};

	const handleInputChange = (
		index: number,
		value: string | number[],
		field?: string,
	) => {
		const stringVal = typeof value === "string" ? value : "";
		const numValue = Number(value) || 1;

		switch (field) {
			case "sets": {
				const newSets = Math.max(numValue, 1);
				setUpdatedSets(newSets);
				setWeights((prev) =>
					newSets > prev.length
						? [...prev, ...Array(newSets - prev.length).fill(0)]
						: prev.slice(0, newSets),
				);
				break;
			}
			case "date":
				setDate(new Date(stringVal));
				break;
			case "newExercise":
				const formatted = capitalizeWords(stringVal);
				setNewExercise(formatted);
				setSelectedExercise(formatted);
				break;
			default:
				if (field?.startsWith("weight")) {
					setWeights((prev) => {
						const next = [...prev];
						next[index] = Number(value) || 0;
						return next;
					});
				}
				if (field?.startsWith("rep")) {
					setUpdatedReps((prev) => {
						const next = [...prev];
						next[index] = Number(value) || next[index];
						return next;
					});
				}
		}
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!selectedExercise && !newExercise) {
			alert("Please select or enter an exercise.");
			return;
		}

		const formData = new FormData(e.target as HTMLFormElement);
		const data = Object.fromEntries(formData.entries());

		const payload = {
			...data,
			sets: updatedSets,
			reps: updatedReps,
			exerciseId: selectedExercise,
			weights,
			distance: selectedExercise === "running" ? Number(data.distance) || 0 : 0,
			userId,
			date,
			exercise: selectedExercise || newExercise,
		};

		try {
			if (newExercise && !(await checkExerciseExists(newExercise))) {
				await addNewExercise(newExercise);
			}
			await submitExerciseSet(payload);
			setSuccessMsg("Added Exercise Set 💪🏻");
		} catch (err) {
			console.error("Submit error:", err);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<Box sx={{ display: "flex", flexDirection: "column" }}>
				<InputLabel htmlFor="exercise">Exercise</InputLabel>
				<select
					id="exercise"
					name="exercise"
					value={selectedExercise}
					onChange={(e) => handleChange(e)}
					style={{
						width: "100%",
						padding: "8px",
						borderRadius: "4px",
						border: "1px solid #ccc",
						fontSize: "16px",
					}}>
					{allExercises.length === 0 && <option value=""></option>}
					{allExercises
						.sort((a, b) => a.exerciseName.localeCompare(b.exerciseName))
						.map((ex) => (
							<option key={ex._id} value={ex.exerciseName}>
								{ex.exerciseName}
							</option>
						))}
					<option value="Not Listed">Exercise Not Listed ➕</option>
				</select>

				{isNewExercise && (
					<Box sx={{ display: "flex", flexDirection: "column" }}>
						<label htmlFor="newExercise">Input New Exercise</label>
						<input
							id="newExercise"
							name="newExercise"
							type="text"
							value={newExercise}
							onChange={(e) =>
								handleInputChange(0, e.target.value, "newExercise")
							}
							style={{
								padding: "8px",
								borderRadius: "4px",
								border: "1px solid #ccc",
								fontSize: "16px",
							}}
						/>
					</Box>
				)}

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

			{successMsg && <p>{successMsg}</p>}

			<Button type="submit" variant="contained" color="primary">
				Submit
			</Button>
		</form>
	);
};
