"use client";

import { ThemeOptions, createTheme } from "@mui/material/styles";

import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const baseThemeOptions = (mode: "light" | "dark"): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          primary: {
            main: "#FF6B6B",
            contrastText: "#FFFFFF",
          },
          secondary: {
            main: "#A8E6CF",
          },
          background: {
            default: "#F9F9F9",
            paper: "#FFFFFF",
          },
          text: {
            primary: "#2E2E2E",
            secondary: "#6F6F6F",
          },
          divider: "#E5E5E5",
        }
      : {
          primary: {
            main: "#FF6B6B",
            contrastText: "#1E1E1E",
          },
          secondary: {
            main: "#A8E6CF",
          },
          background: {
            default: "#1E1E1E",
            paper: "#2A2A2A",
          },
          text: {
            primary: "#F0F0F0",
            secondary: "#B0B0B0",
          },
          divider: "#3A3A3A",
        }),
  },
  typography: {
    fontFamily: montserrat.style.fontFamily,
    body1: { fontSize: 12 },
    h1: { fontSize: 32, fontWeight: 500 },
    h2: { fontSize: 28 },
    h3: { fontSize: 24, fontWeight: 500 },
    h5: { fontSize: 20, fontWeight: 600, padding: "1rem 0" },
    h6: { fontSize: 18, fontWeight: 600, padding: "0.5rem 0" }, // color will be added later
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "20px",
        },
      },
    },
  },
});

export const getTheme = (mode: "light" | "dark") => {
  const baseTheme = createTheme(baseThemeOptions(mode));

  // Extend theme after creation to access palette
  return createTheme(baseTheme);
};
