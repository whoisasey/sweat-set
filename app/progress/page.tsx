"use client";

import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

import Charts from "../components/ui/Charts";
import { useSession } from "next-auth/react";

export type ProcessedWorkoutData = {
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

	return (
		<Box
			sx={{
				margin: "0 auto",
				display: "flex",
				justifyContent: "center",
				flexDirection: "column",
			}}>
			<Typography variant="h2" sx={{ textAlign: "center" }}>
				Workout Progress
			</Typography>
			<Charts exerciseHistory={exerciseHistory} />
		</Box>
	);
};

export default ProgressPage;
