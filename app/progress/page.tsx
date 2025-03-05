"use client";

import React, { useEffect, useState } from "react";

import { useSession } from "next-auth/react";

type ProcessedWorkoutData = {
	exercise: string;
	data: { date: Date; avgWeight: number }[];
};

const ProgressPage = () => {
	const [userId, setUserId] = useState<string>("");
	const [exerciseHistory, setExerciseHistory] = useState<
		ProcessedWorkoutData[]
	>([]);
	const session = useSession();

	useEffect(() => {
		setUserId(session?.data?.user.id ?? "");
	}, [session]);

	useEffect(() => {
		// 1 - if user logged in, gets UserId from session
		// passes userId into fetch request params to exerciseHistory
		// get all history for user only

		const getHistory = async () => {
			try {
				const response = await fetch(`/api/exerciseHistory?user=${userId}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});
				if (!response.ok) {
					throw new Error("Failed to fetch exercises");
				}
				const data = await response.json();
				setExerciseHistory(data);
			} catch (error) {
				console.log(error);
			}
		};
		getHistory();
	}, [userId]);

	return <div>ProgressPage</div>;
};

export default ProgressPage;
