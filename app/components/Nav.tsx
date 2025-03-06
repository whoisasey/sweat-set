"use client";

import { Box, Link } from "@mui/material";

import React from "react";

const Nav = () => {
	return (
		<Box sx={{ display: "flex", justifyContent: "center" }}>
			<Box
				sx={{
					maxWidth: "fit-content",
					display: "flex",
					alignItems: "center",
					textAlign: "center",
					p: 3,
				}}>
				<Link href="/" sx={{ minWidth: 100 }}>
					Home
				</Link>
				<Link href="/progress" sx={{ minWidth: 100 }}>
					Progress
				</Link>
				<Link href="/login" sx={{ minWidth: 100 }}>
					Login
				</Link>
			</Box>
		</Box>
	);
};

export default Nav;
