export interface ExerciseProps {
	name?: string;
	sets: number;
	reps?: number[] | number;
	onRemove: () => void;
	id?: string;
}
