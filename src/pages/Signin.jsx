import { FilePresent, Send } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Container,
  Stack,
  Typography,
  TextField,
} from "@mui/material";
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Fairways.jpg";
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FieldArray,
  FastField,
  useFormik,
} from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useValue } from "../context/ContextProvider";

const Signin = () => {
  const {
    state: { openLogin, loading, currentUser },
    dispatch,
  } = useValue();

  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().required("Please enter email").email("Invalid email"),
    password: Yup.string()
      .required("Please enter password")
      .min(7, "Password should be minimum 7 characters long"),
  });

  const onSubmit = (values) => {
    console.log(values);

    const auth = getAuth();
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        // Signed in
        const userFirebase = userCredential.user;
        Swal.fire({
          title: "Success",
          text: "User successfully signin",
          icon: "success",
          confirmButtonText: "OK!",
        });

        navigate("/dashboard");
        dispatch({
          type: "CURRENT_USER",
          payload: { currentUser: userFirebase.uid },
        });

        console.log(currentUser);
        // ...
      })

      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        Swal.fire({
          title: "Failed",
          text: "Invalid email or password",
          icon: "error",
          confirmButtonText: "OK!",
        });
      });
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
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ errors, isValid, touched, dirty }) => (
              <Form>
                <Field
                  name="email"
                  type="email"
                  as={TextField}
                  variant="outlined"
                  color="primary"
                  label="Email"
                  fullWidth
                  error={Boolean(errors.email) && Boolean(touched.email)}
                  helperText={Boolean(touched.email) && errors.email}
                />

                <Box height={14} />
                <Field
                  name="password"
                  type="password"
                  as={TextField}
                  variant="outlined"
                  color="primary"
                  label="Password"
                  fullWidth
                  error={Boolean(errors.password) && Boolean(touched.password)}
                  helperText={Boolean(touched.password) && errors.password}
                />
                <Box height={14} />

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  LOGIN
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Container>
    </Box>
  );
};

export default Signin;
