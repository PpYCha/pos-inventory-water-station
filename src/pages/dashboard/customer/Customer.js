import { Close, Delete, Edit, Send } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import DataGridComponent from "../../../components/dataGrid/DataGridComponent";
import { useValue } from "../../../context/ContextProvider";
import { customerData } from "../../../data";
import { fDate } from "../../../utils/formatTime";

const Customer = ({ setSelectedLink, link }) => {
  const [customerList, setCustomerList] = useState([{}]);
  const [loading, setLoading] = useState(true);

  const {
    state: { openLogin },
    dispatch,
  } = useValue();

  const fullNameRef = useRef();
  const emailRef = useRef();
  const addressRef = useRef();
  const phoneNumberRef = useRef();
  const birthdateRef = useRef();
  const sexRef = useRef();
  const orderedRef = useRef();
  const debitRef = useRef();

  const handleClose = () => {
    dispatch({ type: "CLOSE_LOGIN" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    setSelectedLink(link);
    fetchAPI();
  }, []);

  const fetchAPI = async () => {
    setLoading(true);
    setCustomerList(customerData);
    setLoading(false);
  };

  const columns = [
    { field: "id", headerName: "ID", hide: true },
    {
      field: "avatarUrl",
      headerName: "",
      minWidth: 30,
      renderCell: (params) => {
        console.log(params.value);
        return (
          <>
            <Avatar alt={params.avatarUrl} src={params.value} />
          </>
        );
      },
    },
    { field: "full_name", headerName: "Full Name", minWidth: 250 },
    { field: "email", headerName: "Email Address", minWidth: 250 },
    { field: "address", headerName: "Address", minWidth: 200 },
    { field: "phoneNumber", headerName: "Phone Number", minWidth: 200 },
    { field: "sex", headerName: "Sex", minWidth: 150 },
    {
      field: "birthdate",
      headerName: "Birthdate",
      minWidth: 150,
      renderCell: (params) => {
        return (
          <>
            <Typography>{fDate(params.value)}</Typography>
          </>
        );
      },
    },
    { field: "ordered", headerName: "Ordered", minWidth: 150 },
    { field: "debit", headerName: "Debit", minWidth: 150 },
    {
      field: "action",
      headerName: "Action",
      minWidth: 150,
      renderCell: (params) => {
        return (
          <>
            <Stack direction="row" spacing={1}>
              <IconButton aria-label="edit">
                <Edit />
              </IconButton>

              <IconButton aria-label="delete">
                <Delete sx={{ color: "red" }} />
              </IconButton>
            </Stack>
          </>
        );
      },
    },
  ];

  return (
    <Box display="flex" flexDirection="column">
      <Paper elevation={3}>
        <Stack direction="row" spacing={2} m={3} justifyContent="space-between">
          <Typography variant="h5">Customer List</Typography>

          <Button
            variant="contained"
            onClick={() => dispatch({ type: "OPEN_LOGIN" })}
          >
            Add New Customer
          </Button>
        </Stack>
        <Dialog open={openLogin} onClose={handleClose}>
          <DialogTitle>
            Customer Information
            <IconButton
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                color: (theme) => theme.palette.grey[500],
              }}
              onClick={handleClose}
            >
              <Close />
            </IconButton>
            <form onSubmit={handleSubmit}>
              <DialogContent dividers>
                <DialogContentText>
                  Please fill customer information in the fields below:
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="normal"
                  variant="standard"
                  id="fullNameRef"
                  label="Full Name"
                  type="text"
                  fullWidth
                  inputRef={fullNameRef}
                  inputProps={{ minLength: 2 }}
                  required
                />
                <TextField
                  margin="normal"
                  variant="standard"
                  id="emailRef"
                  label="Email Address"
                  type="email"
                  fullWidth
                  inputRef={emailRef}
                  inputProps={{ minLength: 2 }}
                  required
                />
                <TextField
                  margin="normal"
                  variant="standard"
                  id="addressRef"
                  label="Address"
                  type="text"
                  fullWidth
                  inputRef={addressRef}
                  inputProps={{ minLength: 2 }}
                  required
                />
                <TextField
                  margin="normal"
                  variant="standard"
                  id="phoneNumberRef"
                  label="Phone Number"
                  type="text"
                  fullWidth
                  inputRef={phoneNumberRef}
                  inputProps={{ minLength: 2 }}
                  required
                />
                <TextField
                  margin="normal"
                  variant="standard"
                  id="birthdateRef"
                  label="Birthdate"
                  InputLabelProps={{ shrink: true }}
                  type="date"
                  fullWidth
                  inputRef={birthdateRef}
                  inputProps={{ minLength: 2 }}
                  required
                />
                <TextField
                  margin="normal"
                  variant="standard"
                  id="sexRef"
                  label="Sex"
                  type="text"
                  fullWidth
                  inputRef={sexRef}
                  inputProps={{ minLength: 2 }}
                  required
                />
                <TextField
                  margin="normal"
                  variant="standard"
                  id="orderedRef"
                  label="Ordered"
                  type="number"
                  fullWidth
                  inputRef={orderedRef}
                  inputProps={{ minLength: 2 }}
                  required
                />
                <TextField
                  margin="normal"
                  variant="standard"
                  id="debitRef"
                  label="Debit"
                  type="number"
                  fullWidth
                  inputRef={debitRef}
                  inputProps={{ minLength: 2 }}
                  required
                />
              </DialogContent>
              <DialogActions sx={{ px: "19px" }}>
                <Button type="submit" variant="contained" endIcon={<Send />}>
                  Submit
                </Button>
              </DialogActions>
            </form>
          </DialogTitle>
        </Dialog>
        <Box m={2}>
          {loading ? (
            <CircularProgress color="secondary" />
          ) : (
            <>
              <DataGridComponent rows={customerList} columns={columns} />
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Customer;
