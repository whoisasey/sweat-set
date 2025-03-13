"use client";

import { useEffect, useState } from "react";

import { ExerciseData } from "@/app/types/ExerciseTypes";

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

export const getTodaysVolume = (workout: ExerciseData) => {
	let totalVolume = 0;

	if (workout.exercise !== "") {
		for (let i = 0; i < workout.sets; i++) {
			totalVolume += workout.weights[i] * workout.reps[i];
		}
		return totalVolume;
	}
	return 0;
};

export const calculatePercentageChange = async (
	prevVolume: number,
	todaysVolume: number,
): Promise<string> => {
	if (prevVolume === 0) {
		return "New Stats Added for Exercise";
	}

	const change = ((todaysVolume - prevVolume) / prevVolume) * 100;
	return `${change.toFixed()}% change in Volume`;
};
