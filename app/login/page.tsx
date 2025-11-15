"use client";

import { Alert, Box, Button, CircularProgress, Container, TextField, Typography } from "@mui/material";
import React, { FormEvent, useCallback, useState } from "react";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      setLoading(true);
      setError("");
      try {
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
      } catch (err) {
        setError("An unexpected error occurred.");
        console.log(err);
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

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
          {loading ? "Logging In..." : "Log In"}
        </Button>

        <Typography variant="body2" sx={{ textAlign: "center", mt: 2 }}>
          Don&apos;t have an account?{" "}
          <Typography
            component="span"
            sx={{
              color: "secondary.main",
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={() => router.push("/register")}
          >
            Create Account
          </Typography>
        </Typography>
      </Box>
    </Container>
  );
};

export default LoginPage;
