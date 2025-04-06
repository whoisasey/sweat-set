"use client";

import { Box, Link } from "@mui/material";

import React from "react";

const Nav = () => {
	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				textAlign: "center",
				justifyContent: "space-around",
				py: 3,
			}}>
			<Link href="/">Home</Link>
			<Link href="/progress">Progress</Link>
			<Link href="/login">Login</Link>
			<Link href="/dashboard">Dashboard</Link>
		</Box>
	);
};

export default Nav;
