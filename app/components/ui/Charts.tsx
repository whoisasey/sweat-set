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
import { formatDate } from "@/app/utils/helpers";
import { useWindowSize } from "@/app/utils/helpers-fe";

const Charts = ({
	exerciseHistory,
	viewState,
}: {
	exerciseHistory: ProcessedWorkoutData[];
	viewState: boolean;
}) => {
	const cardinal = curveCardinal.tension(0.2);

	function filterByToday(data: ProcessedWorkoutData[]) {
		const today = formatDate();

		return data.filter((exercise) =>
			exercise.data.some((entry) => entry.date.toString() == today),
		);
	}
	const width = useWindowSize("width");
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

	const renderChart = (data: ProcessedWorkoutData[], value: number = 1) => {
		return data.map(({ data, exercise }) => (
			<Box
				key={exercise}
				mb={4}
				sx={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
				}}>
				<Typography variant="h6" gutterBottom sx={{ textAlign: "center" }}>
					{exercise}
				</Typography>
				<AreaChart
					width={width && width < 540 ? 300 : 600 / value}
					height={width && width < 540 ? 200 : 300}
					data={data}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis
						dataKey="date"
						tickFormatter={(date) => new Date(date).toLocaleDateString()}
					/>
					<YAxis type="number" domain={[15, "dataMax + 20"]} />
					<Tooltip content={<CustomTooltip />} />
					<Area
						type={cardinal}
						dataKey="avgWeight"
						stroke="#82ca9d"
						fill="#82ca9d"
						fillOpacity={0.3}
					/>
				</AreaChart>
			</Box>
		));
	};

	if (!viewState) {
		const filteredExercises = filterByToday(exerciseHistory);

		if (filteredExercises.length > 0) {
			return (
				<Box sx={{ display: "flex", flexWrap: "wrap" }}>
					{renderChart(filteredExercises, 2)}
				</Box>
			);
		} else {
			return (
				<Box>
					<Typography variant="h5" sx={{ textAlign: "center" }}>
						{"Sorry, no exercises today :("}
					</Typography>
				</Box>
			);
		}
	}

	return (
		<Box sx={{ margin: `${width && width < 540 ? "0" : " 0 auto"}` }}>
			{renderChart(exerciseHistory)}
		</Box>
	);
};

export default Charts;
