"use client";

import { AppBar, Box, Link, Tab, Tabs, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material";
import { signIn, signOut } from "next-auth/react";

import LogoutIcon from "@mui/icons-material/Logout";
import React from "react";
import TimelineIcon from "@mui/icons-material/Timeline";
// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import { useSession } from "next-auth/react";

const Nav = () => {
  const { status } = useSession();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // true for small screens

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
        {isMobile ? (
          <Link href="/" sx={{ textDecoration: "none" }}>
            <WaterDropIcon color="primary" />
          </Link>
        ) : (
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
            <Link href="/" sx={{ textDecoration: "none" }}>
              Sweat Set
            </Link>
          </Typography>
        )}

        <Tabs textColor="inherit" sx={{ width: "100%", justifyContent: "space-around" }}>
          <Tab
            icon={isMobile ? <TimelineIcon color="primary" /> : undefined}
            label={isMobile ? undefined : "Progress"}
            component={Link}
            href="/progress"
          />
          {/* <Tab
            icon={isMobile ? <CalendarMonthIcon /> : undefined}
            label={isMobile ? undefined : "Plan"}
            component={Link}
            href="/dashboard"
          /> */}
          <Tab
            icon={isMobile ? <LogoutIcon color="primary" /> : undefined}
            label={isMobile ? undefined : "Log Out"}
            component={Link}
            onClick={() => signOut()}
          />
        </Tabs>
      </Toolbar>
    </AppBar>
  );
};

export default Nav;
