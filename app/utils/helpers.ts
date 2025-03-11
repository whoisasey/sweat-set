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
