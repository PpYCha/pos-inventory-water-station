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
import { doc, getDoc } from "firebase/firestore";
import { db_firestore } from "../api/firebase";
import BackdropComponent from "../components/BackdropComponent";

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

  const onSubmit = async (values) => {
    console.log(values);
    dispatch({ type: "START_LOADING" });
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const userFirebase = userCredential.user;

      const user = await getUser(userFirebase.uid);
      if (user.status === "Active") {
        if (user.role === "Admin") {
          navigate("/dashboard");
        } else {
          navigate("/dashboard/pos");
        }
        localStorage.setItem("waterUser", JSON.stringify(user));
        dispatch({
          type: "CURRENT_USER",
          payload: user,
        });

        Swal.fire({
          title: "Success",
          text: "User successfully signin",
          icon: "success",
          confirmButtonText: "OK!",
        });

        dispatch({ type: "END_LOADING" });
      } else {
        throw new Error("Banned Account");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Failed",
        text: "Invalid email or password",
        icon: "error",
        confirmButtonText: "OK!",
      });
      dispatch({ type: "END_LOADING" });
    }
  };

  const getUser = async (id) => {
    try {
      const docRef = doc(db_firestore, "users", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());

        return docSnap.data();
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
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
        }}
      >
        <Box
          component="img"
          src={logo}
          sx={{
            maxWidth: "90%",
            maxHeight: "90%",
          }}
        />
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
          <BackdropComponent open={loading} />
        </Box>
      </Container>
    </Box>
  );
};

export default Signin;
