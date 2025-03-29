export type Exercise = {
	_id: string;
	exerciseName: string;
};
export interface ExerciseProps {
	name?: string;
	sets?: number | string | undefined;
	reps?: number[];
	onRemove?: () => void;
	id?: string;
	exercises?: Exercise[];
}
