"use client";

import {
	Area,
	AreaChart,
	CartesianGrid,
	Tooltip,
	TooltipProps,
	XAxis,
	YAxis,
} from "recharts";
import { Box, Typography } from "@mui/material";
import React, { JSX } from "react";

import { ProcessedWorkoutData } from "@/app/progress/page";
import { curveCardinal } from "d3-shape";

const Charts = ({
	exerciseHistory,
}: {
	exerciseHistory: ProcessedWorkoutData[];
}) => {
	const cardinal = curveCardinal.tension(0.2);

	const CustomTooltip = ({
		active,
		payload,
	}: TooltipProps<number, string>): JSX.Element | null => {
		if (active && payload && payload.length) {
			return (
				<Box className="custom-tooltip">
					<p>{payload?.[0]?.payload?.date}</p>
					{payload[0].payload.sets.map(
						(set: { setNumber: number; weight: number }, idx: number) => (
							<p key={idx}>
								Set {set.setNumber}: {set.weight}lbs
							</p>
						),
					)}
				</Box>
			);
		}
		return null;
	};

	return (
		<Box sx={{ width: "auto", margin: "0 auto" }}>
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
						width={350}
						height={250}
						data={exerciseData.data}
						margin={{}}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis
							dataKey="date"
							tickFormatter={(date) => new Date(date).toLocaleDateString()}
						/>
						<YAxis />
						<Tooltip content={<CustomTooltip />} />
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
		</Box>
	);
};

export default Charts;
