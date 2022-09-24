import { LockOutlined } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Typography,
  Paper,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Link from "@mui/material/Link";
import React, { useState } from "react";
import FormInput from "../components/form/FormInput";

const Login = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: "",
    msg: "",
    isLoading: false,
    success: "",
    validation_error: "",
  });

  const [msg, setMsg] = useState({
    status: "",
    message: "",
    error: "",
    success: "",
  });

  const onChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onSignInHandler();
  };

  const onSignInHandler = () => {
    console.log("Login");
    navigate("/dashboard");
  };

  const inputs = [
    {
      id: "email",
      label: "Email Address",
      name: "email",
      pattern: "^[A-Za-z0-9]{3,16}$",
      xs: 12,
      type: "email",
      helperText: typeof msg.error === "undefined" ? false : msg.error.email,
      required: true,
    },
    {
      id: "password",
      label: "Password",
      name: "password",
      type: "password",
      xs: 12,
      helperText: typeof msg.error === "undefined" ? false : msg.error.password,

      required: true,
    },
  ];

  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <Paper elevation={6}>
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          p={2}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlined />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <Grid container spacing={2}>
              {inputs.map((input) => (
                <FormInput
                  key={input.id}
                  {...input}
                  value={user[input.name]}
                  onChange={onChange}
                />
              ))}
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs={12} sm={6}>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Link component={RouterLink} to="/user-signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
