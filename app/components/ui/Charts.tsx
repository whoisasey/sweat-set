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
import React, { JSX, useEffect, useState } from "react";

import { ProcessedWorkoutData } from "@/app/progress/page";
import { curveCardinal } from "d3-shape";

const useWindowSize = (dimension: "width" | "height") => {
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

const Charts = ({
	exerciseHistory,
	viewState,
}: {
	exerciseHistory: ProcessedWorkoutData[];
	viewState: boolean;
}) => {
	const cardinal = curveCardinal.tension(0.2);

	function filterByToday(data: ProcessedWorkoutData[]) {
		const today = new Date().toLocaleDateString("en-US", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
		});

		return data.filter((exercise) =>
			exercise.data.some((entry) => entry.date.toString() == today),
		);
	}
	const width = useWindowSize("width");
	// const height = useWindowSize("height");
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

	if (!viewState) {
		const filteredExercises = filterByToday(exerciseHistory);

		if (filteredExercises.length > 0) {
			return (
				<Box sx={{ display: "flex", flexWrap: "wrap" }}>
					{filteredExercises.map(({ data, exercise }) => (
						<Box key={exercise} mb={4}>
							<AreaChart
								width={width && width < 540 ? 300 / 2 : 600 / 2}
								height={300}
								data={data}
								margin={{}}>
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
							{/* Exercise Name */}
							<Typography
								variant="h6"
								gutterBottom
								sx={{ textAlign: "center" }}
								pl={6}>
								{exercise}
							</Typography>
						</Box>
					))}
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
		<Box sx={{ width: "auto", margin: "0 auto" }}>
			{exerciseHistory.map((exerciseData) => (
				<Box key={exerciseData.exercise} mb={4}>
					<AreaChart
						width={width && width < 540 ? 300 : 600}
						height={300}
						data={exerciseData.data}
						margin={{}}>
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
					{/* Exercise Name */}
					<Typography variant="h6" sx={{ textAlign: "center" }} pl={6}>
						{exerciseData.exercise}
					</Typography>
				</Box>
			))}
		</Box>
	);
};

export default Charts;
