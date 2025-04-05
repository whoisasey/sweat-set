"use client";

import { Box, Button, Card, Typography } from "@mui/material";
import React, { useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import { ExerciseForm } from "./SingleExercise";
import { workoutPlan } from "@/app/data/workoutPlan";

type WorkoutsType = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any; // Add an index signature to allow dynamic property access
	plan: {
		week: number;
		focus: string;
		days: {
			weekday: string;
			date: string | Date;
			type: string;
			exercises?: {
				name: string;
				sets: number;
				reps: number[];
			}[];
		}[];
	}[];
};

const ExercisePlan = () => {
	// TODO: fix to updated data
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [workouts, setWorkouts] = useState<WorkoutsType>({
		plan: workoutPlan.map((plan) => ({
			...plan,
			days: plan.days.map((day) => ({
				...day,
				date: new Date(day?.date ?? ""),
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

	// const todaysDate = new Date("2025-04-04T04:00:00.000Z");
	const todaysDate = new Date();
	const formattedToday = todaysDate.toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	// map over workoutPlan and filter the object that matches todays date
	const todaysWorkout = workoutPlan
		.flatMap((week) => week.days)
		.find((day) => {
			return day.date?.trim() === formattedToday;
		});

	return (
		<Box sx={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
			<Typography variant="h5" fontWeight="bold">
				{todaysWorkout?.weekday} - {todaysWorkout?.type}
			</Typography>
			{todaysWorkout?.exercises === undefined && (
				<Typography variant="h6">Rest Day!</Typography>
			)}

			{todaysWorkout?.exercises?.map(({ name, reps, sets }, idx) => {
				return (
					<Card
						key={idx}
						sx={{
							mb: 2,
							p: 2,
							my: 2,
							border: "1px solid #ccc",
							boxShadow: 0,
							borderRadius: "8px",
						}}>
						<ExerciseForm
							key={name}
							id={name}
							name={name}
							sets={sets}
							reps={reps}
							onRemove={() => removeExercise(todaysWorkout.weekday, idx)}
						/>
						<Button
							variant="outlined"
							startIcon={<AddIcon />}
							// onClick={addexercise}
							sx={{ mt: 2 }}>
							Add Exercise
						</Button>
					</Card>
				);
			})}
		</Box>
	);
};

export default ExercisePlan;
