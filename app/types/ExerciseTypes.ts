export interface ExerciseData {
	exercise: string;
	exerciseId: string;
	weights: number[];
	sets: number;
	reps: number[];
	distance: number;
	userId: string;
	date: string;
	_id: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
}

export interface ExerciseProps {
	name?: string;
	sets: number;
	reps: number[];
	onRemove: () => void;
	id: string;
}
