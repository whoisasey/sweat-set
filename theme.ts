"use client";

import { Montserrat } from "next/font/google";
import { createTheme } from "@mui/material/styles";

const montserrat = Montserrat({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

let theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#FF6B6B", // Soft Coral
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#A8E6CF", // Cool Mint
    },
    background: {
      default: "#F9F9F9", // Misty White
      paper: "#FFFFFF",
    },
    text: {
      primary: "#2E2E2E", // Charcoal
      secondary: "#6F6F6F", // Soft Gray for less prominent text
    },
    divider: "#E5E5E5", // Light Grey
    error: {
      main: "#FF6B6B", // You can reuse primary here if needed
    },
  },
});

theme = createTheme(theme, {
  typography: {
    fontFamily: montserrat.style.fontFamily,
    body1: { fontSize: 12 },
    h1: { fontSize: 32, fontWeight: 500 },
    h2: { fontSize: 28 },
    h3: {
      fontSize: 24,
      fontWeight: 500,
    },
    h5: {
      fontSize: 20,
      fontWeight: 600,
      padding: "1rem 0",
    },
    h6: {
      fontSize: 18,
      fontWeight: 600,
      padding: "0.5rem 0",
    },
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

export default theme;
