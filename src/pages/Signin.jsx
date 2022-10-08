import { FilePresent, Send } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Fairways.jpg";

const Signin = () => {
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate("/dashboard");
  };

  return (
    <Box display={"flex"}>
      <Card
        sx={{
          width: "100%",
          maxWidth: "50%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          margin: (2, 0, 2, 2),
          backgroundColor: "#019BE3",
        }}
      >
        {/* <CardHeader
          title={<Typography variant="h2">Hi, Welcome Back</Typography>}
        /> */}
        <Box component="img" src={logo} />
      </Card>
      <Container maxWidth="sm">
        <Box
          sx={{
            maxWidth: 480,
            margin: "auto",
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            padding: (12, 0),
          }}
        >
          <Typography variant="h4" gutterBottom>
            Sign in
          </Typography>

          <Typography sx={{ color: "text.secondary", mb: 5 }}>
            Enter your details below.
          </Typography>

          <form>
            <Stack spacing={3}>
              <TextField
                name="email"
                label="Email Address"
                fullWidth
                required
              />
              <TextField
                name="password"
                label="Password"
                fullWidth
                type="password"
                required
              />
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ my: 2 }}
            >
              <Button
                type="submit"
                variant="contained"
                fullWidth
                onSubmit={handleSubmit()}
              >
                Login
              </Button>
            </Stack>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default Signin;
