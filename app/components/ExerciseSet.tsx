// "use client";

// import { Button, Card, Typography } from "@mui/material";

// import AddIcon from "@mui/icons-material/Add";
// import { ExerciseForm } from "@/app/components/SingleExercise";
// import { ExerciseProps } from "@/app/types/ExerciseTypes";

// // import { DndContext, closestCenter } from "@dnd-kit/core";
// // import {
// // 	SortableContext,
// // 	verticalListSortingStrategy,
// // } from "@dnd-kit/sortable";

// // Workout Day Component
// interface WorkoutDayProps {
// 	// day: string;
// 	exercises: ExerciseProps[];
// 	// title: string;
// 	onAddExercise: () => void;
// 	onRemoveExercise: (index: number) => void;
// 	// onDragEnd: (event: {
// 	// 	active: { id: string };
// 	// 	over: { id: string } | null;
// 	// }) => void;
// }

// const ExerciseSet: React.FC<WorkoutDayProps> = ({
// 	day,
// 	title,
// 	exercises,
// 	onAddExercise,
// 	onRemoveExercise,
// 	// onDragEnd,
// }) => {
// 	return (
// 		<Card sx={{ p: 2, mb: 2 }}>
// 			{/* <Typography variant="h5" fontWeight="bold">
// 				{day} - {title}
// 			</Typography> */}
// 			{/* <DndContext
// 				collisionDetection={closestCenter}
// 				// onDragEnd={onDragEnd}
// 			> */}
// 			{/* <SortableContext
// 				items={exercises.map((e) => e.id)}
// 				strategy={verticalListSortingStrategy}> */}
// 			{exercises &&
// 				exercises.map(({ name, reps, sets }, idx) => (

// 				))}
// 			{/* </SortableContext> */}
// 			{/* </DndContext> */}

// 		</Card>
// 	);
// };

// export default ExerciseSet;
