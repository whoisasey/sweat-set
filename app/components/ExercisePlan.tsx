"use client";

import React, { useState } from "react";

import { Box } from "@mui/material";
import ExerciseSet from "./ExerciseSet";
import { workoutPlan } from "@/app/data/workoutPlan";

type WorkoutsType = {
	workoutPlan: {
		week: number;
		focus: string;
		days: {
			weekday: string;
			type: string;
			exercises?: {
				name: string;
				sets: number;
				rep: number;
			}[];
		}[];
	}[];
};

const ExercisePlan = () => {
	const [workouts, setWorkouts] = useState<WorkoutsType>({
		workoutPlan: workoutPlan.map((plan) => ({
			...plan,
			days: plan.days.map((day) => ({
				...day,
				exercises: day.exercises?.map((exercise) => ({
					name: exercise.name,
					sets: exercise.sets,
					rep: exercise.rep,
				})),
			})),
			...workoutPlan,
		})),
	});

	// const addExercise = (day: string) => {
	// 	const newExercise = {
	// 		id: `exercise-${Date.now()}`,
	// 		name: "New Exercise",
	// 		sets: 3,
	// 		reps: [10],
	// 	};
	// 	setWorkouts((prev) => ({
	// 		...prev,
	// 		[day]: [...prev[day], newExercise],
	// 	}));
	// };

	// interface RemoveExerciseProps {
	// 	day: string;
	// 	index: number;
	// }

	const removeExercise = (
		weekday: string,
		idx: number,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		p0?: { weekday: string; idx: number },
	) => {
		// setWorkouts(
		// 	(prev) =>{
		// 	...prev,
		// 			// TODO: target nested days array and remove exercise
		// 			// [weekday]: prev[weekday].filter((_, i) => i !== idx),
		// 		},
		// );
		setWorkouts((prev) => ({
			...prev,
			[weekday]: prev[weekday].filter((_, i) => i !== idx),
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

	// console.log(workoutPlan);

	return (
		<Box sx={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
			{workoutPlan.map(({ days }) => {
				return days.map(({ weekday, exercises }, idx) => {
					return (
						<ExerciseSet
							key={idx}
							day={weekday}
							exercises={(exercises || []).map((exercise, idx) => ({
								...exercise,
								onRemove: () => removeExercise(weekday, idx, { weekday, idx }),
							}))}
							// onAddExercise={() => addExercise(weekday)}
							onRemoveExercise={(idx) => removeExercise(weekday, idx)}
							// onDragEnd={onDragEnd}
						/>
					);
				});
			})}
		</Box>
	);
};

export default ExercisePlan;
