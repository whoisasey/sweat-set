"use client";

import { useEffect, useState } from "react";

export const useWindowSize = (dimension: "width" | "height") => {
	const [size, setSize] = useState<number | undefined>(undefined);

	useEffect(() => {
		const handleResize = () => {
			setSize(dimension === "width" ? window.innerWidth : window.innerHeight);
		};

		handleResize();

		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, [dimension]);
	return size;
};

// const generateDateRange = (startDate: Date): { [key: number]: string }[] => {
// 	const dateArray: { [key: number]: string }[] = [];

// 	for (let i = 0; i < 14; i++) {
// 		const newDate = new Date(startDate);
// 		newDate.setDate(startDate.getDate() + i);
// 		dateArray.push({ [i]: newDate.toDateString() });
// 	}

// 	return dateArray;
// };

// Initial start date updated to March 30, 2025
const currentStartDate = new Date(Date.UTC(2025, 2, 30, 5, 0, 0));

// Function to regenerate the array every two weeks
export const updateDateArray = () => {
	// const dateArray = generateDateRange(currentStartDate);
	currentStartDate.setDate(currentStartDate.getDate() + 14); // Move to the next 2-week period
};

// Call this function every two weeks
setInterval(updateDateArray, 14 * 24 * 60 * 60 * 1000);

// Mapping weekdays to their corresponding date index
export const weekdayToIndexMap: { [key: string]: number } = {
	Sunday: 0,
	Monday: 1,
	Tuesday: 2,
	Wednesday: 3,
	Thursday: 4,
	Friday: 5,
	Saturday: 6,
};
