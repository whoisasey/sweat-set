"use client";

import { Box, Container, TextField, Typography } from "@mui/material";
import React, { useState } from "react";

import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

const RegisterPage = () => {
  // const { setAuthData } = useUser();

  const [formState, setFormState] = useState({
    formData: {
      firstName: "",
      // lastName: "",
      // name: "",
      email: "",
      password: "",
      userId: uuidv4(),
    },
    loading: false,
  });

  const {
    formData,
    // loading
  } = formState;
  const router = useRouter();

  const updateState = (newState: Partial<typeof formState>) => {
    setFormState((prev) => ({ ...prev, ...newState }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // onChange(name, value);
    updateState({
      formData: { ...formData, [name]: value },
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        // const data = await response.json();
        // console.log(data);
        // TODO: after successful registration, redirect to login with autocomplete info
        // redirect to login
        router.push("/login");
      }
    } catch (err) {
      console.error("Error submitting form ❌", err);
      // updateState({ error: "An unexpected error occurred." });
    } finally {
      updateState({ loading: false });
    }
  };

  return (
    <Container sx={{ position: "relative", padding: 0 }}>
      <Typography variant="h5">Register</Typography>

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <TextField
            type="text"
            placeholder="Name"
            value={formData.firstName}
            onChange={handleChange}
            name="firstName"
            onBlur={() => window.scrollTo(0, 0)}
          />
          <TextField
            type="email"
            autoComplete="new-email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            name="email"
            onBlur={() => window.scrollTo(0, 0)}
          />
          <TextField
            type="password"
            autoComplete="new-password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            name="password"
            onBlur={() => window.scrollTo(0, 0)}
          />
        </Box>
        <button type="submit">Register</button>
      </form>
    </Container>
  );
};

export default RegisterPage;
