"use client";

import React, { useState } from "react";

import { Box } from "@mui/material";
import ExerciseSet from "./ExerciseSet";

type WorkoutsType = {
	[day: string]: { id: string; name: string; sets: number; reps: number }[];
};

const ExercisePlan = () => {
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
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
		<Box sx={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
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
		</Box>
	);
};

export default ExercisePlan;
