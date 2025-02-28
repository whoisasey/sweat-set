"use client";

import { Button, Card, IconButton, Typography } from "@mui/material";
import { DndContext, closestCenter } from "@dnd-kit/core";
import React, { useState } from "react";
import {
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import AddIcon from "@mui/icons-material/Add";
import { CSS } from "@dnd-kit/utilities";
import DeleteIcon from "@mui/icons-material/Delete";
// import { DragEndEvent } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";

// Exercise Component
interface ExerciseProps {
	name: string;
	sets: number;
	reps: number;
	onRemove: () => void;
	id: string;
}

const Exercise: React.FC<ExerciseProps> = ({
	name,
	sets,
	reps,
	onRemove,
	id,
}) => {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id });
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<Card
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			sx={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				p: 2,
				mb: 1,
			}}>
			<div>
				<Typography variant="h6">{name}</Typography>
				<Typography variant="body2" color="textSecondary">
					{sets} sets x {reps} reps
				</Typography>
			</div>
			<IconButton color="error" onClick={onRemove}>
				<DeleteIcon />
			</IconButton>
		</Card>
	);
};

// Workout Day Component
interface WorkoutDayProps {
	day: string;
	exercises: ExerciseProps[];
	onAddExercise: () => void;
	onRemoveExercise: (index: number) => void;
	// onDragEnd: (event: {
	// 	active: { id: string };
	// 	over: { id: string } | null;
	// }) => void;
}

const WorkoutDay: React.FC<WorkoutDayProps> = ({
	day,
	exercises,
	onAddExercise,
	onRemoveExercise,
	// onDragEnd,
}) => {
	return (
		<Card sx={{ p: 3, mb: 2 }}>
			<Typography variant="h5" fontWeight="bold">
				{day}
			</Typography>
			<DndContext
				collisionDetection={closestCenter}
				// onDragEnd={onDragEnd}
			>
				<SortableContext
					items={exercises.map((e) => e.id)}
					strategy={verticalListSortingStrategy}>
					{exercises.map((exercise, index) => (
						<Exercise
							key={exercise.id}
							id={exercise.id}
							name={exercise.name}
							sets={exercise.sets}
							reps={exercise.reps}
							onRemove={() => onRemoveExercise(index)}
						/>
					))}
				</SortableContext>
			</DndContext>
			<Button
				variant="outlined"
				startIcon={<AddIcon />}
				onClick={onAddExercise}
				sx={{ mt: 2 }}>
				Add Exercise
			</Button>
		</Card>
	);
};

// Workout Plan Component
type WorkoutsType = {
	[day: string]: { id: string; name: string; sets: number; reps: number }[];
};

const WorkoutPlan = () => {
	const [workouts, setWorkouts] = useState<WorkoutsType>({
		Monday: [{ id: "squat", name: "Squat", sets: 3, reps: 6 }],
		Tuesday: [{ id: "running", name: "Running", sets: 1, reps: 30 }],
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
			{Object.keys(workouts).map((day) => (
				<WorkoutDay
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
