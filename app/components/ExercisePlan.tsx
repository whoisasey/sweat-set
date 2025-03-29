"use client";

import React, { useState } from "react";

import { Box } from "@mui/material";
import ExerciseSet from "./ExerciseSet";
import { workoutPlan } from "@/app/data/workoutPlan";

type WorkoutsType = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any; // Add an index signature to allow dynamic property access
	plan: {
		week: number;
		focus: string;
		days: {
			weekday: string;
			type: string;
			exercises?: {
				name: string;
				sets: number;
				reps: number[];
			}[];
		}[];
	}[];
};

// const ExercisePlan = () => {
// 	const [workouts, setWorkouts] = useState<WorkoutsType>({
// 		plan: workoutPlan.map((plan) => ({
// 			...plan,
// 			days: plan.days.map((day) => ({
// 				...day,
// 				exercises: day.exercises?.map((exercise) => ({
// 					name: exercise.name,
// 					sets: exercise.reps ?? 0,
// 					reps: exercise.sets ?? 0,
// 				})),
// 			})),
// 			...workoutPlan,
// 		})),
// 	});
const ExercisePlan = () => {
	const [workouts, setWorkouts] = useState<WorkoutsType>({
		plan: workoutPlan.map((plan) => ({
			...plan,
			days: plan.days.map((day) => ({
				...day,
				exercises: day.exercises?.map((exercise) => ({
					name: exercise.name,
					sets: exercise.sets ?? 0,
					reps: exercise.reps.map((rep) => rep ?? 0),
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
		setWorkouts((prev: WorkoutsType) => ({
			...prev,
			plan: prev.plan.map((plan: WorkoutsType["plan"][number]) => ({
				...plan,
				days: plan.days.map(
					(day: WorkoutsType["plan"][number]["days"][number]) =>
						day.weekday === weekday
							? {
									...day,
									exercises: day.exercises?.filter((_, i: number) => i !== idx),
							  }
							: day,
				),
			})),
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

	const { plan } = workouts;

	return (
		<Box sx={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
			{plan.map(({ days }) => {
				return days.map(({ weekday, exercises, type }, idx) => {
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
							title={type}
							onAddExercise={function (): void {
								throw new Error("Function not implemented.");
							}} // onDragEnd={onDragEnd}
						/>
					);
				});
			})}
		</Box>
	);
};

export default ExercisePlan;
