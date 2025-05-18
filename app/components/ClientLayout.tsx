"use client";

import { ThemeProvider, useMediaQuery } from "@mui/material";

import Nav from "@/app/components/Nav";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { getTheme } from "@/theme";
import { useMemo } from "react";

interface ClientLayoutProps {
  children: React.ReactNode;
  session: Session | null; // You can replace `any` with `Session | null` from next-auth if desired
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children, session }) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = useMemo(() => getTheme(prefersDarkMode ? "dark" : "light"), [prefersDarkMode]);

  return (
    <ThemeProvider theme={theme}>
      <SessionProvider session={session}>
        <Nav />
        {children}
      </SessionProvider>
    </ThemeProvider>
  );
};

export default ClientLayout;
