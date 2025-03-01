import { Button, Card, Typography } from "@mui/material";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import AddIcon from "@mui/icons-material/Add";
import { ExerciseForm } from "@/app/components/SingleExercise";

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

interface ExerciseProps {
	name?: string;
	sets: number;
	reps: number;
	onRemove: () => void;
	id: string;
}

const ExerciseSet: React.FC<WorkoutDayProps> = ({
	day,
	exercises,
	onAddExercise,
	onRemoveExercise,
	// onDragEnd,
}) => {
	return (
		<Card sx={{ p: 3, mb: 2 }}>
			{"exercise set"}
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
						<ExerciseForm
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

export default ExerciseSet;
