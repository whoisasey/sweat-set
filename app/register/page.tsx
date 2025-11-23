"use client";

import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Link,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { VALID_INVITE_CODES } from "@/app/config/inviteCodes";

const RegisterPage = () => {
  const [formState, setFormState] = useState({
    formData: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      birthdate: null as Date | null,
      weight: "",
      userId: uuidv4(),
      gender: "",
      inviteCode: "",
    },
    loading: false,
    error: "",
    inviteCodeValid: false,
  });

  const { formData, loading, error, inviteCodeValid } = formState;
  const router = useRouter();

  const updateState = (newState: Partial<typeof formState>) => {
    setFormState((prev) => ({ ...prev, ...newState }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "inviteCode") {
      const isValid = VALID_INVITE_CODES.includes(value.trim().toUpperCase());
      updateState({
        formData: { ...formData, [name]: value },
        inviteCodeValid: isValid,
        error: isValid ? "" : error,
      });
    } else {
      updateState({
        formData: { ...formData, [name]: value },
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!inviteCodeValid) {
      updateState({ error: "Please enter a valid invite code to register." });
      return;
    }
    
    updateState({ loading: true, error: "" });

    try {
      const response = await fetch("/api/user/add", {
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
        <TextField
          type="text"
          label="Invite Code"
          placeholder="Enter your invite code"
          value={formData.inviteCode}
          onChange={handleChange}
          name="inviteCode"
          fullWidth
          required
          error={formData.inviteCode !== "" && !inviteCodeValid}
          helperText={
            formData.inviteCode !== "" && !inviteCodeValid
              ? "Invalid invite code"
              : inviteCodeValid
              ? "Valid code ✓"
              : ""
          }
          color={inviteCodeValid ? "success" : undefined}
        />

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
        <FormControl fullWidth>
          <FormLabel>Gender Identity</FormLabel>
          <FormHelperText>
            This information helps improve the accuracy of your health metrics. This will not be shown on your profile.
          </FormHelperText>
          <RadioGroup name="gender" value={formData.gender} onChange={handleChange}>
            <FormControlLabel value="male" control={<Radio />} label="Male" />
            <FormControlLabel value="female" control={<Radio />} label="Female" />
            <FormControlLabel value="non-binary" control={<Radio />} label="Non-binary / X" />
            <FormControlLabel value="prefer-not-to-say" control={<Radio />} label="Prefer not to say" />
          </RadioGroup>
        </FormControl>

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
    </Container>
  );
};

export default RegisterPage;
