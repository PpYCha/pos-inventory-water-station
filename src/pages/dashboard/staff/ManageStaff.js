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
import React, { useEffect, useRef } from "react";
import DataGridComponent from "../../../components/dataGrid/DataGridComponent";
import { useValue } from "../../../context/ContextProvider";
import { employeeData } from "../../../data";
import { fDate } from "../../../utils/formatTime";

const ManageStaff = ({ setSelectedLink, link }) => {
  //   console.log(employeeData);

  const {
    state: { openLogin, loading },
    dispatch,
  } = useValue();

  const nameEmployeeRef = useRef();
  const emailRef = useRef();
  const positionRef = useRef();
  const addressRef = useRef();
  const phoneNumberRef = useRef();
  const sexRef = useRef();
  const birthdateRef = useRef();
  const salaryRef = useRef();

  const handleClose = () => {
    dispatch({ type: "CLOSE_LOGIN" });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 1, hide: true },
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
    { field: "name", headerName: "Name", minWidth: 250 },
    { field: "email", headerName: "Email Address", minWidth: 250 },
    { field: "position", headerName: "Position", minWidth: 50 },
    { field: "address", headerName: "Address", minWidth: 200 },
    { field: "phoneNumber", headerName: "Phone#", minWidth: 150 },
    { field: "sex", headerName: "Sex", minWidth: 10 },
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

    { field: "salary", headerName: "Salary", minWidth: 10 },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
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

  useEffect(() => {
    setSelectedLink(link);
  }, []);
  return (
    <Box display="flex" flexDirection="column">
      <Paper elevation={3}>
        <Stack direction="row" spacing={2} m={3} justifyContent="space-between">
          <Typography variant="h5">Employee List</Typography>

          <Button
            variant="contained"
            onClick={() => dispatch({ type: "OPEN_LOGIN" })}
          >
            Add New Employee
          </Button>
        </Stack>
        <Dialog open={openLogin} onClose={handleClose}>
          <DialogTitle>
            Employee Information
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
                  id="nameEmployeeRef"
                  label="Full Name"
                  type="text"
                  fullWidth
                  inputRef={nameEmployeeRef}
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
                  id="positionRef"
                  label="Position"
                  type="text"
                  fullWidth
                  inputRef={positionRef}
                  inputProps={{ minLength: 2 }}
                  required
                />
                <TextField
                  margin="normal"
                  variant="standard"
                  id="phoneNumberRef"
                  label="Phone#"
                  type="number"
                  fullWidth
                  inputRef={phoneNumberRef}
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
                  id="salary"
                  label="Salary"
                  type="number"
                  fullWidth
                  inputRef={salaryRef}
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
              <DataGridComponent rows={employeeData} columns={columns} />
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
};
export default ManageStaff;
