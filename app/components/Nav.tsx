"use client";

import { Box, Link } from "@mui/material";
import { signIn, signOut } from "next-auth/react";

import React from "react";
import { useSession } from "next-auth/react";

const Nav = () => {
	const { status } = useSession();

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
			<Link
				component={"button"}
				onClick={() => {
					(() => (status === "authenticated" ? signOut() : signIn()))();
				}}>
				{status === "authenticated" ? "Log Out" : "Login"}
			</Link>
			<Link href="/dashboard">Dashboard</Link>
		</Box>
	);
};

export default Nav;
