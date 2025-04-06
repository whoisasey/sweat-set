export type Exercise = {
	_id: string;
	exerciseName: string;
};
export interface ExerciseProps {
	name?: string;
	sets?: number;
	reps?: number[];
	onRemove?: () => void;
	id?: string;
	exercises?: Exercise[];
}
