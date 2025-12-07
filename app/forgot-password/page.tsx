"use client";

import { Alert, Box, Button, CircularProgress, Container, Link, TextField, Typography } from "@mui/material";
import React, { FormEvent, useState } from "react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setEmail("");
      } else {
        setError(data.message || "Failed to send password reset email");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
        Forgot Password
      </Typography>

      {success ? (
        <Box>
          <Alert severity="success" sx={{ mb: 3 }}>
            If an account with that email exists, a password reset link has been sent. Please check your email.
          </Alert>
          <Typography variant="body2" sx={{ textAlign: "center" }}>
            <Link href="/login">
              <Typography
                component="span"
                sx={{
                  color: "secondary.main",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Return to Login
              </Typography>
            </Link>
          </Typography>
        </Box>
      ) : (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Enter your email address and we&apos;ll send you a link to reset your password.
          </Typography>

          <TextField
            type="email"
            label="Email"
            placeholder="Email address"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            autoFocus
          />

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
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>

          <Typography variant="body2" sx={{ textAlign: "center", mt: 2 }}>
            Remember your password?{" "}
            <Link href="/login">
              <Typography
                component="span"
                sx={{
                  color: "secondary.main",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Log In
              </Typography>
            </Link>
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default ForgotPasswordPage;
