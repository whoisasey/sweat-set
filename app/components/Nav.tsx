"use client";

import { AppBar, Tab, Tabs, Toolbar, useMediaQuery, useTheme } from "@mui/material";

// import DashboardIcon from "@mui/icons-material/Dashboard";
import HomeIcon from "@mui/icons-material/Home";
import Link from "next/link";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonIcon from "@mui/icons-material/Person";
import TimelineIcon from "@mui/icons-material/Timeline";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import { signOut } from "next-auth/react";
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
    const validTabValues = ["/", "/login", "/register"];
    const tabValue = validTabValues.includes(pathname) ? pathname : false;

    return (
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Tabs value={tabValue} textColor="inherit" sx={{ width: "100%", justifyContent: "space-between" }}>
            <Tab
              icon={isMobile ? <HomeIcon color="primary" /> : undefined}
              label={isMobile ? undefined : "Home"}
              component={Link}
              href="/"
              value="/"
            />
            <Tab
              icon={isMobile ? <LoginIcon color="primary" /> : undefined}
              label={isMobile ? undefined : "Login"}
              component={Link}
              href="/login"
              value="/login"
            />
            <Tab
              icon={isMobile ? <PersonAddIcon color="primary" /> : undefined}
              label={isMobile ? undefined : "Register"}
              component={Link}
              href="/register"
              value="/register"
            />
          </Tabs>
        </Toolbar>
      </AppBar>
    );
  }

  const validTabValues = ["/", "/progress", "/dashboard", "/profile"];
  const tabValue = validTabValues.includes(pathname) ? pathname : false;

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Tabs value={tabValue} textColor="inherit" sx={{ width: "100%", justifyContent: "space-between" }}>
          <Tab
            icon={isMobile ? <WaterDropIcon color="primary" /> : undefined}
            label={isMobile ? undefined : "Sweat Set"}
            component={Link}
            href="/"
            value="/"
          />
          <Tab
            icon={isMobile ? <TimelineIcon color="primary" /> : undefined}
            label={isMobile ? undefined : "Progress"}
            component={Link}
            href="/progress"
            value="/progress"
            className="progress"
          />
          {/* <Tab
            icon={isMobile ? <DashboardIcon color="primary" /> : undefined}
            label={isMobile ? undefined : "Dashboard"}
            component={Link}
            href="/dashboard"
            value="/dashboard"
          /> */}
          <Tab
            icon={isMobile ? <PersonIcon color="primary" /> : undefined}
            label={isMobile ? undefined : "Profile"}
            component={Link}
            href="/profile"
            value="/profile"
            className="profile"
          />
          <Tab
            icon={isMobile ? <LogoutIcon color="primary" /> : undefined}
            label={isMobile ? undefined : "Log Out"}
            onClick={() => signOut()}
          />
        </Tabs>
      </Toolbar>
    </AppBar>
  );
};

export default Nav;
