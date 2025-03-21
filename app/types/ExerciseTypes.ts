export interface ExerciseProps {
	name?: string;
	sets: number;
	reps: number[];
	onRemove: () => void;
	id: string;
}
