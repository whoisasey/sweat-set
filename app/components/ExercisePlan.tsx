"use client";

import { Box, Button, Card, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import { ExerciseForm } from "./SingleExercise";
import { workoutPlan } from "@/app/data/workoutPlan";

type Exercise = {
	name: string;
	sets: number;
	reps: number[];
};

type Day = {
	weekday: string;
	date: string | Date;
	type: string;
	exercises?: Exercise[];
};

type Plan = {
	week: number;
	focus: string;
	days: Day[];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type WorkoutsType = {
	plan: Plan[];
};

const ExercisePlan = () => {
	const [todaysPlan, setTodaysPlan] = useState<Day | null>(null);

	useEffect(() => {
		const today = new Date("2025-04-04T04:00:00.000Z");
		// const todaysDate = new Date();

		// Replace with `new Date()` in production
		const formattedToday = today.toLocaleDateString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		});

		const match = workoutPlan
			.flatMap((week) => week.days)
			.find((day) => day.date?.trim() === formattedToday);

		setTodaysPlan(match ?? null);
	}, []);

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

	// TODO: fix with new data
	const removeExercise = (idx: number) => {
		setTodaysPlan((prev) => {
			if (!prev || !prev.exercises) return prev;

			const updatedExercises = prev.exercises.filter((_, i) => i !== idx);
			return {
				...prev,
				exercises: updatedExercises,
			};
		});
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

	// map over workoutPlan and filter the object that matches todays date
	// const todaysWorkout = workoutPlan
	// 	.flatMap((week) => week.days)
	// 	.find((day) => {
	// 		return day.date?.trim() === formattedToday;
	// 	});
	// console.log(todaysWorkout);

	// TODO later: add exercise to the workout plan if its a recovery day
	return (
		<Box sx={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
			<Typography variant="h5" fontWeight="bold">
				{todaysPlan?.weekday} - {todaysPlan?.type}
			</Typography>
			{todaysPlan?.exercises === undefined && (
				<Typography variant="h6">Rest Day!</Typography>
			)}

			{todaysPlan?.exercises?.map(({ name, reps, sets }, idx) => {
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
							onRemove={() => removeExercise(idx)}
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
