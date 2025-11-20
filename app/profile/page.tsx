"use client";

import { Alert, Box, CircularProgress, List, ListItem, ListItemText, Typography } from "@mui/material";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(`/api/profile`, {
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch user: ${response.statusText}`);
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
        setError(error instanceof Error ? error.message : "Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

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

  // TODO: add update User functionality

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>

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
