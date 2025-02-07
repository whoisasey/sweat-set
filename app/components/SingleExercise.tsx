"use client";

import {
	Box,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Typography,
} from "@mui/material";
import React, { FormEvent } from "react";

const SingleExercise = () => {
	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log(e);

		return;
	};
	return (
		<Box>
			<Typography variant="h4">Single Exercise</Typography>
			<form onSubmit={handleSubmit}>
				<InputLabel htmlFor="exercise">Exercise</InputLabel>
				<Select defaultValue={10} id="exercise" name="exercise">
					<MenuItem value={10}>Ten</MenuItem>
					<MenuItem value={20}>Twenty</MenuItem>
					<MenuItem value={30}>Thirty</MenuItem>
				</Select>
				<Box>
					<InputLabel sx={{}}>Input Weight</InputLabel>
					<TextField
						autoComplete="new-password"
						type="number"
						placeholder="Weight"
						// value={formData.password}
						name="weight"
						required
						// onChange={handleChange}
					/>
				</Box>
				<Box>
					<InputLabel sx={{}}>Input Reps</InputLabel>
					<TextField
						autoComplete="new-password"
						type="number"
						placeholder="Reps"
						// value={formData.password}
						name="reps"
						required
						// onChange={handleChange}
					/>
				</Box>
			</form>
		</Box>
	);
};

export default SingleExercise;
