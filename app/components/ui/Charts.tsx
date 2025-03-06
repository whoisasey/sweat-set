import {
	Area,
	AreaChart,
	CartesianGrid,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { Box, Typography } from "@mui/material";

import { ProcessedWorkoutData } from "@/app/progress/page";
import React from "react";
import { curveCardinal } from "d3-shape";

const Charts = ({
	exerciseHistory,
}: {
	exerciseHistory: ProcessedWorkoutData[];
}) => {
	const cardinal = curveCardinal.tension(0.2);

	return (
		<Box sx={{ maxWidth: "500px", margin: "0 auto" }}>
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
		</Box>
	);
};

export default Charts;
