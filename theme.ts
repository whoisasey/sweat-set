"use client";

import { Montserrat } from "next/font/google";
import { createTheme } from "@mui/material/styles";

const montserrat = Montserrat({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

let theme = createTheme({});

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
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
        },
      },
    },
  },
});

export default theme;
