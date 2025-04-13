export const capitalizeWords = (value: string) => {
	return value
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(" ");
};

export const formatDate = (dateString?: string | Date) => {
	return new Date(dateString ?? Date.now()).toLocaleDateString("en-US", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});
};

export const fetchExercises = async () => {
	const res = await fetch("/api/exercise/get");
	if (!res.ok) throw new Error("Failed to fetch exercises");
	return res.json();
};

export const checkExerciseExists = async (name: string) => {
	const res = await fetch(`/api/exercise/check?name=${name}`);
	if (!res.ok) throw new Error("Failed to check exercise existence");
	const data = await res.json();
	return data.exists;
};

export const addNewExercise = async (name: string) => {
	const res = await fetch("/api/exercise/add", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ exerciseName: name }),
	});
	if (!res.ok) throw new Error("Failed to add new exercise");
};

export const submitExerciseSet = async (data: Record<string, unknown>) => {
	const res = await fetch("/api/exerciseSet/add", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Failed to submit exercise set");
};
