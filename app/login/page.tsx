"use client";

import { Box, Button, TextField, Typography } from "@mui/material";
import React, { FormEvent, useCallback, useState } from "react";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [error, setError] = useState<string>("");
  // const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      // setLoading(true);
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
        }
        router.push("/");
      } catch (err) {
        setError("An unexpected error occurred.");
        console.log(err);
      }
      // finally {
      // 	setLoading(false);
      // }
    },
    [router]
  );

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column" }}>
      <TextField
        type="text"
        placeholder="Email address"
        autoComplete="email"
        name="email"
        id="email"
        fullWidth
        required
        sx={{ fontSize: "16px" }}
      />
      <TextField
        type="password"
        autoComplete="password"
        placeholder="Password"
        name="password"
        id="password"
        required
        fullWidth
        sx={{ fontSize: "16px" }}
      />
      <Typography variant="body1" sx={{ color: "red", textAlign: "center" }}>
        {error && error}
      </Typography>
      <Button type="submit" variant="contained" color="secondary" fullWidth>
        Log In
      </Button>
    </Box>
  );
};

export default LoginPage;
