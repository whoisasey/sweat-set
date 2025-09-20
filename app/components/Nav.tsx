"use client";

import { AppBar, Box, Link, Tab, Tabs, Toolbar, useMediaQuery, useTheme } from "@mui/material";
import { signIn, signOut } from "next-auth/react";

import HomeIcon from "@mui/icons-material/Home";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import TimelineIcon from "@mui/icons-material/Timeline";
// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const Nav = () => {
  const { data: session, status } = useSession();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // true for small screens
  const pathname = usePathname();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      localStorage.setItem("userId", session.user.id);
    }
  }, [status, session]);

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
        {isMobile ? (
          <Link href="/">
            <HomeIcon color="primary" />
          </Link>
        ) : (
          <Link href="/">Home</Link>
        )}
        {isMobile ? (
          <Link component={"button"} onClick={() => signIn()}>
            <LoginIcon color="primary" />
          </Link>
        ) : (
          <Link component={"button"} onClick={() => signIn()}>
            Login
          </Link>
        )}
      </Box>
    );
  }

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Tabs value={pathname} textColor="inherit" sx={{ width: "100%", justifyContent: "space-between" }}>
          <Tab
            icon={isMobile ? <WaterDropIcon color="primary" /> : undefined}
            label={isMobile ? undefined : "Sweat Set"}
            component={Link}
            href="/"
            value={"/"}
          />

          <Tab
            icon={isMobile ? <TimelineIcon color="primary" /> : undefined}
            label={isMobile ? undefined : "Progress"}
            component={Link}
            href="/progress"
            value={"/progress"}
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
            onClick={() => signOut()}
            value={"/login"}
          />
        </Tabs>
      </Toolbar>
    </AppBar>
  );
};

export default Nav;
