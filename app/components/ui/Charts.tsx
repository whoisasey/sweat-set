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
}: {
	exerciseHistory: ProcessedWorkoutData[];
}) => {
	const cardinal = curveCardinal.tension(0.2);

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

	return (
		<Box sx={{ width: "auto", margin: "0 auto" }}>
			{exerciseHistory.map((exerciseData) => (
				<Box key={exerciseData.exercise} mb={4}>
					{/* Exercise Name */}
					<Typography variant="h6" gutterBottom>
						{exerciseData.exercise}
					</Typography>

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
						<YAxis type="number" domain={[20, "dataMax + 20"]} />
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
			))}
		</Box>
	);
};

export default Charts;
