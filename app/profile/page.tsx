"use client";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface User {
  userId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  birthdate?: string;
  weight?: number;
  createdAt?: string;
  updatedAt?: string;
}

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { status } = useSession();
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    birthdate: null as Date | null,
    weight: undefined as number | undefined,
  });

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(`/api/user/get`, {
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch user: ${response.statusText}`);
        }

        const data = await response.json();
        setUser(data);
        // Initialize form data with user data
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          birthdate: data.birthdate ? new Date(data.birthdate) : null,
          weight: data.weight || undefined,
        });
      } catch (error) {
        console.error("Error fetching user:", error);
        setError(error instanceof Error ? error.message : "Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  if (status === "unauthenticated") {
    router.push("/login");
  }

  // Calculate age from birthdate
  const calculateAge = (birthdate?: string) => {
    if (!birthdate) return null;
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box p={3}>
        <Alert severity="warning">No user data found</Alert>
      </Box>
    );
  }

  const age = calculateAge(user.birthdate);

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form data to current user data when canceling
      setFormData({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        birthdate: user?.birthdate ? new Date(user.birthdate) : null,
        weight: user?.weight || undefined,
      });
    }
    setIsEditing(!isEditing);
    setSuccessMessage(null);
    setError(null);
  };

  const handleInputChange = (field: keyof typeof formData, value: string | number | Date | null) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Convert Date to ISO string for API
      const dataToSend = {
        ...formData,
        birthdate: formData.birthdate ? formData.birthdate.toISOString() : undefined,
      };

      const response = await fetch("/api/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setIsEditing(false);
      setSuccessMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {isEditing ? (
        <Box component="form" sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="First Name"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            margin="normal"
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date of Birth"
              value={formData.birthdate}
              onChange={(newValue) => handleInputChange("birthdate", newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: "normal",
                  placeholder: "MM/DD/YYYY",
                },
              }}
              maxDate={new Date()}
            />
          </LocalizationProvider>
          <TextField
            fullWidth
            label="Weight (lb)"
            type="number"
            value={formData.weight || ""}
            onChange={(e) => handleInputChange("weight", parseFloat(e.target.value) || 0)}
            margin="normal"
          />

          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button variant="contained" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            <Button variant="outlined" onClick={handleEditToggle} disabled={saving}>
              Cancel
            </Button>
          </Box>
        </Box>
      ) : (
        <>
          <List>
            {user.firstName && user.lastName && (
              <ListItem>
                <ListItemText primary="Name" secondary={`${user.firstName} ${user.lastName}`} />
              </ListItem>
            )}

            {user.email && (
              <ListItem>
                <ListItemText primary="Email" secondary={user.email} />
              </ListItem>
            )}

            {age !== null && (
              <ListItem>
                <ListItemText primary="Age" secondary={`${age} years old`} />
              </ListItem>
            )}

            {user.weight && (
              <ListItem>
                <ListItemText primary="Weight" secondary={`${user.weight} lb`} />
              </ListItem>
            )}
          </List>

          <Button variant="outlined" sx={{ mt: 2 }} onClick={handleEditToggle}>
            Update Profile
          </Button>
        </>
      )}

      {/* TODO: Goals section */}
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Goals
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No goals set yet
        </Typography>
      </Box>
    </Box>
  );
};

export default ProfilePage;
