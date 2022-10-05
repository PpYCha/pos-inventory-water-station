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
import { useEffect, useRef } from "react";
import DataGridComponent from "../../../components/dataGrid/DataGridComponent";
import { useValue } from "../../../context/ContextProvider";
import { usersData } from "../../../data";
import { fDate } from "../../../utils/formatTime";

const Users = ({ setSelectedLink, link }) => {
  const fullNameRef = useRef();
  const emailRef = useRef();
  const usernameRef = useRef();
  const passwordRef = useRef();
  const phoneNumberRef = useRef();
  const statusRef = useRef();
  const roleRef = useRef();

  const {
    state: { openLogin, loading },
    dispatch,
  } = useValue();

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
        return (
          <>
            <Avatar alt={params.avatarUrl} src={params.value} />
          </>
        );
      },
    },
    { field: "name", headerName: "Name", minWidth: 250 },
    { field: "email", headerName: "Email Address", minWidth: 250 },
    { field: "username", headerName: "Username", minWidth: 250 },
    { field: "password", headerName: "Password", minWidth: 200, hide: true },
    { field: "phoneNumber", headerName: "Phone#", minWidth: 150 },
    { field: "status", headerName: "Status", minWidth: 10 },

    { field: "role", headerName: "Role", minWidth: 10 },
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
          <Typography variant="h5">Users List</Typography>

          <Button
            variant="contained"
            onClick={() => dispatch({ type: "OPEN_LOGIN" })}
          >
            Add New User
          </Button>
        </Stack>
        <Dialog open={openLogin} onClose={handleClose}>
          <DialogTitle>
            User Information
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
                  Please fill product information in the fields below:
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="normal"
                  variant="standard"
                  id="fullNameRef"
                  label="Name"
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
                  id="usernameRef"
                  label="Username"
                  type="text"
                  fullWidth
                  inputRef={usernameRef}
                  inputProps={{ minLength: 2 }}
                  required
                />
                <TextField
                  margin="normal"
                  variant="standard"
                  id="passwordRef"
                  label="Password"
                  type="password"
                  fullWidth
                  inputRef={passwordRef}
                  inputProps={{ minLength: 2 }}
                  required
                />
                <TextField
                  margin="normal"
                  variant="standard"
                  id="phoneNumberRef"
                  label="Phone#"
                  type="text"
                  fullWidth
                  inputRef={phoneNumberRef}
                  inputProps={{ minLength: 2 }}
                  required
                />
                <TextField
                  margin="normal"
                  variant="standard"
                  id="statusRef"
                  label="Status"
                  type="text"
                  fullWidth
                  inputRef={statusRef}
                  inputProps={{ minLength: 2 }}
                  required
                />
                <TextField
                  margin="normal"
                  variant="standard"
                  id="roleRef"
                  label="Role"
                  type="text"
                  fullWidth
                  inputRef={roleRef}
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
              <DataGridComponent rows={usersData} columns={columns} />
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Users;
