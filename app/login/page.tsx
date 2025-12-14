"use client";

import { Alert, Box, Button, CircularProgress, Container, Divider, Link, TextField, Typography } from "@mui/material";
import React, { FormEvent, useCallback, useState, useEffect } from "react";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [useMagicLink, setUseMagicLink] = useState<boolean>(false);
  const [magicLinkSent, setMagicLinkSent] = useState<boolean>(false);
  const [processingMagicLink, setProcessingMagicLink] = useState<boolean>(false);
  const router = useRouter();

  // Handle magic link callback on page load
  useEffect(() => {
    const handleMagicLinkCallback = async () => {
      // Check if there's a hash in the URL (magic link tokens)
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const access_token = hashParams.get("access_token");

      if (access_token) {
        setProcessingMagicLink(true);
        try {
          // Verify the magic link token with our API
          const response = await fetch("/api/auth/magic-link", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ access_token }),
          });

          const data = await response.json();

          if (response.ok && data.success && data.email) {
            // Sign in with NextAuth using the magic-link provider
            const result = await signIn("magic-link", {
              email: data.email,
              redirect: false,
            });

            if (result?.error) {
              setError("Failed to create session");
              setProcessingMagicLink(false);
            } else {
              router.push("/");
            }
          } else {
            setError(data.message || "Invalid magic link");
            setProcessingMagicLink(false);
          }
        } catch (err) {
          console.error("Error processing magic link:", err);
          setError("An error occurred while processing your login");
          setProcessingMagicLink(false);
        }
      }
    };

    handleMagicLinkCallback();
  }, [router]);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      setLoading(true);
      setError("");
      setMagicLinkSent(false);

      try {
        if (useMagicLink) {
          // Send magic link
          const response = await fetch("/api/auth/magic-link", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });

          const data = await response.json();

          if (response.ok) {
            setMagicLinkSent(true);
          } else {
            setError(data.message || "Failed to send magic link");
          }
        } else {
          // Regular password login
          const result = await signIn("credentials", {
            email: email,
            password: password,
            redirect: false,
          });

          if (result?.error) {
            setError("Email or Password is incorrect. Please try again.");
            console.log(result.error);
          } else {
            router.push("/");
          }
        }
      } catch (err) {
        setError("An unexpected error occurred.");
        console.log(err);
      } finally {
        setLoading(false);
      }
    },
    [router, useMagicLink]
  );

  // Show loading state while processing magic link
  if (processingMagicLink) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: "center" }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          <CircularProgress size={60} />
          <Typography variant="h6">Verifying your magic link...</Typography>
          <Typography variant="body2" color="text.secondary">
            Please wait while we sign you in
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        position: "relative",
        padding: 4,
        mt: 4,
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Welcome Back
      </Typography>

      {magicLinkSent ? (
        <Alert severity="success" sx={{ mb: 3 }}>
          Magic link sent! Check your email to sign in.
        </Alert>
      ) : null}

      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          type="email"
          label="Email"
          placeholder="Email address"
          autoComplete="email"
          name="email"
          id="email"
          fullWidth
          required
        />
        {!useMagicLink && (
          <TextField
            type="password"
            label="Password"
            placeholder="Password"
            autoComplete="current-password"
            name="password"
            id="password"
            required
            fullWidth
          />
        )}

        {!useMagicLink && (
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Link href="/forgot-password">
              <Typography
                variant="body2"
                sx={{
                  color: "secondary.main",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Forgot Password?
              </Typography>
            </Link>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {error}
          </Alert>
        )}

        <Button
          type="submit"
          variant="contained"
          color="secondary"
          fullWidth
          disabled={loading}
          sx={{ mt: 2, py: 1.5, fontSize: "1rem" }}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? (useMagicLink ? "Sending Link..." : "Logging In...") : useMagicLink ? "Send Magic Link" : "Log In"}
        </Button>

        <Divider sx={{ my: 2 }}>OR</Divider>

        <Button
          type="button"
          variant="outlined"
          color="secondary"
          fullWidth
          onClick={() => {
            setUseMagicLink(!useMagicLink);
            setError("");
            setMagicLinkSent(false);
          }}
          sx={{ py: 1.5, fontSize: "1rem" }}
        >
          {useMagicLink ? "Sign in with Password" : "Sign in with Magic Link"}
        </Button>

        <Typography variant="body2" sx={{ textAlign: "center", mt: 2 }}>
          Don&apos;t have an account?{" "}
          <Link href="/register">
            <Typography
              component="span"
              sx={{
                color: "secondary.main",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Create Account
            </Typography>
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default LoginPage;
