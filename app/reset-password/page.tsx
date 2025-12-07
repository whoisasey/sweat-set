"use client";

import { Alert, Box, Button, CircularProgress, Container, Link, TextField, Typography } from "@mui/material";
import React, { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    // Get token from URL hash (Supabase sends it as #access_token=...)
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get("access_token");

    if (accessToken) {
      setToken(accessToken);
    } else {
      setError("Invalid or missing reset token. Please request a new password reset link.");
    }
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setError(data.message || "Failed to reset password");
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
        Reset Password
      </Typography>

      {success ? (
        <Box>
          <Alert severity="success" sx={{ mb: 3 }}>
            Password reset successfully! Redirecting to login...
          </Alert>
        </Box>
      ) : (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Enter your new password below.
          </Typography>

          <TextField
            type="password"
            label="New Password"
            placeholder="New password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            autoFocus
            disabled={!token || loading}
          />

          <TextField
            type="password"
            label="Confirm Password"
            placeholder="Confirm password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            required
            disabled={!token || loading}
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
            disabled={loading || !token}
            sx={{ mt: 2, py: 1.5, fontSize: "1rem" }}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? "Resetting..." : "Reset Password"}
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

export default ResetPasswordPage;
