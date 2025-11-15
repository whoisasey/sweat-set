"use client";

import { Alert, Box, Button, Container, TextField, Typography } from "@mui/material";
import React, { useState } from "react";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

const RegisterPage = () => {
  // const { setAuthData } = useUser();

  const [formState, setFormState] = useState({
    formData: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      birthdate: null as Date | null,
      weight: "",
      userId: uuidv4(),
    },
    loading: false,
    error: "",
  });

  const { formData, loading, error } = formState;
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
    updateState({ loading: true, error: "" });

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
      } else {
        const data = await response.json();
        updateState({ error: data.message || "Registration failed. Please try again." });
      }
    } catch (err) {
      console.error("Error submitting form ❌", err);
      updateState({ error: "An unexpected error occurred." });
    } finally {
      updateState({ loading: false });
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
        Create Account
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            type="text"
            label="First Name"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            name="firstName"
            fullWidth
            required
          />
          <TextField
            type="text"
            label="Last Name"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            name="lastName"
            fullWidth
            required
          />
        </Box>

        <TextField
          type="email"
          autoComplete="new-email"
          label="Email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          name="email"
          fullWidth
          required
        />

        <TextField
          type="password"
          autoComplete="new-password"
          label="Password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          name="password"
          fullWidth
          required
        />

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Date of Birth"
            value={formData.birthdate}
            onChange={(newValue) => {
              updateState({
                formData: { ...formData, birthdate: newValue },
              });
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                required: true,
                placeholder: "MM/DD/YYYY",
              },
            }}
            maxDate={new Date()}
          />
        </LocalizationProvider>

        <TextField
          type="number"
          label="Weight (lbs)"
          placeholder="Weight"
          value={formData.weight}
          onChange={handleChange}
          name="weight"
          fullWidth
          inputProps={{ min: 0, step: 0.1 }}
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
        >
          {loading ? "Creating Account..." : "Register"}
        </Button>

        <Typography variant="body2" sx={{ textAlign: "center", mt: 2 }}>
          Already have an account?{" "}
          <Typography
            component="span"
            sx={{
              color: "secondary.main",
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={() => router.push("/login")}
          >
            Log In
          </Typography>
        </Typography>
      </Box>
    </Container>
  );
};

export default RegisterPage;
