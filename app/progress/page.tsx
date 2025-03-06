"use client";

import {
	Area,
	AreaChart,
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

import { curveCardinal } from "d3-shape";
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

	const cardinal = curveCardinal.tension(0.2);

	return (
		<div className="w-full h-96">
			<h2 className="text-lg font-bold">Workout Progress</h2>

			{exerciseHistory.map((exerciseData) => (
				<Box key={exerciseData.exercise} mb={4}>
					{/* Exercise Name */}
					<Typography variant="h6" gutterBottom>
						{exerciseData.exercise}
					</Typography>

					{/* Chart */}
					{/* <ResponsiveContainer width="100%" height={300}>
						<LineChart data={exerciseData.data}>
							<XAxis
								dataKey="date"
								tickFormatter={(date) => new Date(date).toLocaleDateString()}
							/>
							<YAxis />
							<Tooltip />
							<Line
								type="monotoneX"
								dataKey="avgWeight"
								stroke="#8884d8"
								fill="#8884d8"
								fillOpacity={0.3}
							/>
						</LineChart>
					</ResponsiveContainer> */}
					<AreaChart
						width={500}
						height={400}
						data={exerciseData.data}
						margin={{
							top: 10,
							right: 30,
							left: 0,
							bottom: 0,
						}}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis
							dataKey="date"
							tickFormatter={(date) => new Date(date).toLocaleDateString()}
						/>
						<YAxis />
						<Tooltip />
						{/* <Area
							type="monotone"
							dataKey="avgWeight"
							stroke="#8884d8"
							fill="#8884d8"
							fillOpacity={0.3}
						/> */}
						<Area
							type={cardinal}
							dataKey="avgWeight"
							stroke="#82ca9d"
							fill="#82ca9d"
							fillOpacity={0.3}
						/>
					</AreaChart>
				</Box>
			))}
		</div>
	);
};

export default ProgressPage;
