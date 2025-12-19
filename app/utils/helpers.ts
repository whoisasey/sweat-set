export const capitalizeWords = (value: string) => {
	return value
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(" ");
};

/**
 * Formats a date in Eastern Time (UTC-5)
 * @param dateString - Optional date string or Date object
 * @returns Formatted date string in MM/DD/YYYY format
 */
export const formatDate = (dateString?: string | Date) => {
	return new Date(dateString ?? Date.now()).toLocaleDateString("en-US", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		timeZone: "America/New_York", // Eastern Time
	});
};

/**
 * Formats a date object to display in Eastern Time (UTC-5)
 * @param date - Date object or date string to format
 * @returns Formatted date string in locale format (Eastern Time)
 */
export const formatDateInEasternTime = (date: string | Date) => {
	return new Date(date).toLocaleDateString("en-US", {
		timeZone: "America/New_York", // Eastern Time
	});
};
