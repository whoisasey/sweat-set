"use client";

import { AppBar, Box, Link, Tab, Tabs, Toolbar, Typography } from "@mui/material";
import { signIn, signOut } from "next-auth/react";

import React from "react";
import { useSession } from "next-auth/react";

const Nav = () => {
  const { status } = useSession();

  if (status === "unauthenticated") {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          textAlign: "center",
          justifyContent: "space-around",
          py: 3,
        }}
      >
        <Link href="/">Home</Link>
        <Link component={"button"} onClick={() => signIn()}>
          Login
        </Link>
      </Box>
    );
  }

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link href="/">Sweat Set</Link>
        </Typography>

        <Tabs value={0} textColor="inherit">
          <Tab label="Progress" component={Link} href="/progress" />
          <Tab label="Dashboard" component={Link} href="/dashboard" />
          <Tab
            label="Log Out"
            component={Link}
            onClick={() => {
              signOut();
            }}
          />
        </Tabs>
      </Toolbar>
    </AppBar>
  );
};

export default Nav;
