"use client";

import { Box, Typography } from "@mui/material";

import { workoutPlan } from "@/app/data/workoutPlan";

const DashboardPage = () => {
	return (
		<Box>
			<Typography variant="h4">Workout Plan</Typography>
			<Box>
				{workoutPlan.map(({ week, days, focus }, idx) => (
					<Box key={idx}>
						<Typography variant="h5">
							Week {week}: {focus}
						</Typography>
						{days.map(({ type, weekday, exercises }, idx) => (
							<Box key={idx}>
								<Typography variant="h6">
									{weekday} - {type}
								</Typography>
								{exercises?.map(({ name, reps, sets }, idx) => (
									<Box key={idx}>
										{name} - {sets} sets x {reps[idx]} reps
									</Box>
								))}
							</Box>
						))}
					</Box>
				))}
			</Box>
		</Box>
	);
};

export default DashboardPage;
