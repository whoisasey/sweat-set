"use client";

import { Alert, Box, CircularProgress, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check if there's a hash in the URL (magic link tokens)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const access_token = hashParams.get("access_token");

        console.log("Hash params:", Object.fromEntries(hashParams.entries()));

        if (access_token) {
          // This is a magic link - verify with backend and create NextAuth session
          const response = await fetch("/api/auth/magic-link", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ access_token }),
          });

          const data = await response.json();

          if (response.ok && data.success) {
            // Set the NextAuth session cookie
            Cookies.set(data.cookieName, data.sessionToken, {
              expires: 30, // 30 days
              path: "/",
              sameSite: "lax",
              secure: process.env.NODE_ENV === "production",
            });

            // Redirect to home page and reload to pick up the new session
            window.location.href = "/";
          } else {
            setError(data.message || "Invalid magic link");
            setProcessing(false);
          }
        } else {
          // No magic link tokens, redirect to login
          router.push("/login");
        }
      } catch (err) {
        console.error("Error processing magic link:", err);
        setError("An error occurred while processing your login");
        setProcessing(false);
      }
    };

    handleCallback();
  }, [router]);

  return (
    <Container maxWidth="sm" sx={{ mt: 8, textAlign: "center" }}>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
        {processing ? (
          <>
            <CircularProgress size={60} />
            <Typography variant="h6">Verifying your magic link...</Typography>
            <Typography variant="body2" color="text.secondary">
              Please wait while we sign you in
            </Typography>
          </>
        ) : error ? (
          <>
            <Alert severity="error" sx={{ width: "100%" }}>
              {error}
            </Alert>
            <Typography
              variant="body2"
              sx={{ color: "secondary.main", cursor: "pointer", textDecoration: "underline" }}
              onClick={() => router.push("/login")}
            >
              Return to login
            </Typography>
          </>
        ) : null}
      </Box>
    </Container>
  );
}
