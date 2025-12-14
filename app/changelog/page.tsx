"use client";

import { Box, Chip, Container, Divider, Paper, Typography } from "@mui/material";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface ChangelogEntry {
  version: string;
  date: string;
  changes: {
    type: "new" | "improved" | "fixed";
    description: string;
  }[];
}

const changelog: ChangelogEntry[] = [
  {
    version: "1.1.0",
    date: "December 14, 2024",
    changes: [
      {
        type: "new",
        description: "Magic link login - sign in without a password using email",
      },
      {
        type: "new",
        description: "Password reset via email",
      },
      {
        type: "improved",
        description: "Enhanced email notifications",
      },
    ],
  },
];

const ChangelogPage = () => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const getChipColor = (type: "new" | "improved" | "fixed") => {
    switch (type) {
      case "new":
        return "success";
      case "improved":
        return "info";
      case "fixed":
        return "warning";
    }
  };

  const getChipLabel = (type: "new" | "improved" | "fixed") => {
    switch (type) {
      case "new":
        return "New";
      case "improved":
        return "Improved";
      case "fixed":
        return "Fixed";
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          What&apos;s New
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Latest updates and improvements to Sweat Set
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {changelog.map((entry, index) => (
          <Paper key={index} elevation={2} sx={{ p: 3 }}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                  Version {entry.version}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {entry.date}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {entry.changes.map((change, changeIndex) => (
                <Box key={changeIndex} sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                  <Chip
                    label={getChipLabel(change.type)}
                    color={getChipColor(change.type)}
                    size="small"
                    sx={{ minWidth: 80 }}
                  />
                  <Typography variant="body1" sx={{ pt: 0.25 }}>
                    {change.description}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        ))}
      </Box>
    </Container>
  );
};

export default ChangelogPage;
