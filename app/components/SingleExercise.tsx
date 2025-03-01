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
import ExerciseSet from "./ExerciseSet";
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
		// </Box>
	);
};

// Workout Plan Component
type WorkoutsType = {
	[day: string]: { id: string; name: string; sets: number; reps: number }[];
};

const WorkoutPlan = () => {
	const [workouts, setWorkouts] = useState<WorkoutsType>({
		Monday: [{ id: "squat", name: "Squat", sets: 3, reps: 6 }],
		// Tuesday: [{ id: "running", name: "Running", sets: 1, reps: 30 }],
	});

	const addExercise = (day: string) => {
		const newExercise = {
			id: `exercise-${Date.now()}`,
			name: "New Exercise",
			sets: 3,
			reps: 10,
		};
		setWorkouts((prev) => ({
			...prev,
			[day]: [...prev[day], newExercise],
		}));
	};

	// interface RemoveExerciseProps {
	// 	day: string;
	// 	index: number;
	// }

	const removeExercise = (
		day: string,
		index: number,
		p0?: { day: string; index: number },
	) => {
		setWorkouts((prev) => ({
			...prev,
			[day]: prev[day].filter((_, i) => i !== index),
		}));
	};

	// const onDragEnd = (event: DragEndEvent) => {
	// 	const { active, over } = event;
	// 	if (!over || active.id === over.id) return;

	// 	setWorkouts((prev) => {
	// 		const updatedWorkouts = { ...prev };
	// 		for (const day in updatedWorkouts) {
	// 			const currentExercises = updatedWorkouts[day];
	// 			const oldIndex = currentExercises.findIndex((e) => e.id === active.id);
	// 			const newIndex = currentExercises.findIndex((e) => e.id === over.id);
	// 			if (oldIndex !== -1 && newIndex !== -1) {
	// 				updatedWorkouts[day] = arrayMove(
	// 					currentExercises,
	// 					oldIndex,
	// 					newIndex,
	// 				);
	// 				break;
	// 			}
	// 		}
	// 		return updatedWorkouts;
	// 	});
	// };

	return (
		<div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
			{"workout plan"}
			{Object.keys(workouts).map((day) => (
				<ExerciseSet
					key={day}
					day={day}
					exercises={workouts[day].map((exercise, index) => ({
						...exercise,
						onRemove: () => removeExercise(day, index, { day, index }),
					}))}
					onAddExercise={() => addExercise(day)}
					onRemoveExercise={(index) => removeExercise(day, index)}
					// onDragEnd={onDragEnd}
				/>
			))}
		</div>
	);
};

export default WorkoutPlan;
