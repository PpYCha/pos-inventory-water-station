import {
  Add,
  Close,
  Delete,
  Edit,
  FileCopy,
  Print,
  RemoveRedEye,
  Save,
  SaveOutlined,
  Send,
  Share,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  Grid,
  IconButton,
  Paper,
  SpeedDial,
  SpeedDialAction,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import DataGridComponent from "../../../components/dataGrid/DataGridComponent";
import DialogComponent from "../../../components/form/DialogComponent";
import { useValue } from "../../../context/ContextProvider";
import { usersData } from "../../../data";
import { fDate } from "../../../utils/formatTime";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import { GRID_CHECKBOX_SELECTION_COL_DEF } from "@mui/x-data-grid";
import AutocompleteComponent from "../../../components/form/AutocompleteComponent";
import SpeedialComponent from "../../../components/SpeedialComponent";
import { sentenceCase } from "change-case";
import FormInput from "../../../components/form/FormInput";
import Swal from "sweetalert2";
import * as Yup from "yup";
import ImageComponent from "../../../components/image/ImageComponent";
import MaterialReactTable from "material-react-table";

const actions = [
  { icon: <Add />, name: "Add" },
  { icon: <RemoveRedEye />, name: "View" },
  { icon: <Edit />, name: "Edit" },
  { icon: <Delete />, name: "Delete" },
];

const Users = ({ setSelectedLink, link }) => {
  const fullNameRef = useRef();
  const emailRef = useRef();
  const usernameRef = useRef();
  const passwordRef = useRef();
  const phoneNumberRef = useRef();
  const statusRef = useRef();
  const roleRef = useRef();

  const [open, setOpen] = useState(false);
  const handleOpenSpeedial = (e) => {
    setOpen(true);
  };
  const handleCloseSpeedial = (e) => {
    setOpen(false);
  };

  const {
    state: {
      openLogin,
      loading,
      user: { id, name, email, password, phoneNumber, role, status },
    },
    dispatch,
  } = useValue();

  const handleClose = () => {
    dispatch({ type: "CLOSE_LOGIN" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleClose();
    Swal.fire({
      title: "Success",
      text: "User successfully added",
      icon: "success",
      confirmButtonText: "OK!",
    });
  };

  const handleAction = (e) => {
    console.log(e.target);

    if (e.target.dataset.testid === "AddIcon") {
      dispatch({ type: "OPEN_LOGIN" });
    }
    if (e.target.dataset.testid === "RemoveEyeIcon") {
      dispatch({ type: "OPEN_LOGIN" });
    }
    if (e.target.dataset.testid === "EditIcon") {
      dispatch({ type: "OPEN_LOGIN" });
    }
    if (e.target.dataset.testid === "DeleteIcon") {
      dispatch({ type: "OPEN_LOGIN" });
    }
  };

  // const columns = [
  //   { field: "id", headerName: "ID", flex: 1, hide: true },
  //   {
  //     field: "avatarUrl",
  //     headerName: "",
  //     minWidth: 30,
  //     renderCell: (params) => {
  //       return (
  //         <>
  //           <Avatar alt={params.avatarUrl} src={params.value} />
  //         </>
  //       );
  //     },
  //   },
  //   { field: "name", headerName: "Name", minWidth: 250 },
  //   { field: "email", headerName: "Email Address", minWidth: 250 },

  //   { field: "password", headerName: "Password", minWidth: 200, hide: true },
  //   { field: "phoneNumber", headerName: "Phone#", minWidth: 150 },
  //   {
  //     field: "status",
  //     headerName: "Status",
  //     minWidth: 100,
  //     renderCell: (params) => {
  //       return (
  //         <>
  //           <Chip
  //             variant="ghost"
  //             color={(params.value === "banned" && "error") || "success"}
  //             label={sentenceCase(params.value)}
  //             sx={{ minWidth: 70 }}
  //           />
  //         </>
  //       );
  //     },
  //   },

  //   { field: "role", headerName: "Role", minWidth: 10 },
  // ];

  const columns = useMemo(() => [
    {
      accessorKey: "id",
      header: "ID",
    },

    {
      accessorKey: "name",
      header: "Name",
      Cell: ({ cell, row }) => (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <Avatar alt={cell.avatarUrl} src={row.original.avatarUrl} />
            <Typography>{cell.getValue()}</Typography>
          </Box>
        </>
      ),
    },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "username", header: "Password" },
    { accessorKey: "phoneNumber", header: "Phone Number" },
    { accessorKey: "status", header: "Status" },
    { accessorKey: "role", header: "Role" },
  ]);

  const inputs = [
    // {
    //   id: "id",
    //   label: "ID",
    //   name: "id",
    //   xs: 12,
    //   sm: 12,
    //   type: "text",
    //   disabled: true,
    // },
    {
      id: "name",
      label: "Name",
      name: "name",
      xs: 12,
      sm: 12,
      type: "text",
      required: true,
    },
    {
      id: "email",
      label: "Email Address",
      name: "email",
      pattern: "^[A-Za-z0-9]{3,16}$",
      xs: 12,
      sm: 12,
      type: "email",
      required: true,
    },
    {
      id: "password",
      label: "Password",
      name: "password",
      xs: 12,
      sm: 12,
      type: "password",
      required: true,
    },
    {
      id: "phoneNumber",
      label: "Phone Number",
      name: "phoneNumber",
      type: "text",
      xs: 12,
      sm: 12,
      required: true,
    },
  ];

  const autoCompleteInputs = [
    {
      name: "Role",
      label: ["Admin", "Cashier"],
      value1: role,
    },
    {
      name: "Status",
      label: ["Active", "Banned"],
      value1: status,
    },
  ];

  useEffect(() => {
    setSelectedLink(link);
  }, []);
  return (
    <Box display="flex" flexDirection="column">
      <Paper elevation={24}>
        <Stack direction="row" spacing={2} m={3} justifyContent="space-between">
          <Typography variant="h5">Users List</Typography>
        </Stack>

        <Dialog onClose={handleClose} open={openLogin} fullWidth maxWidth="lg">
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
          </DialogTitle>

          <form onSubmit={handleSubmit} action="#">
            <DialogContent dividers>
              <DialogContentText>
                Please fill product information in the fields :
              </DialogContentText>
              <Grid container>
                <Grid item>
                  <ImageComponent />
                </Grid>
                {inputs.map((input) => (
                  <FormInput key={input.id} {...input} />
                ))}

                {autoCompleteInputs?.map((autoCompleteInput, index) => {
                  return (
                    <AutocompleteComponent
                      key={index}
                      options={autoCompleteInput.label}
                      label={autoCompleteInput.name}
                      id={autoCompleteInput.name}
                      value1={autoCompleteInput.value}
                    />
                  );
                })}
              </Grid>
            </DialogContent>
            <DialogActions sx={{ px: "19px" }}>
              <Button
                type="submit"
                variant="contained"
                color="success"
                endIcon={<SaveOutlined />}
              >
                Submit
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        <Box m={2}>
          {loading ? (
            <CircularProgress color="secondary" />
          ) : (
            <>
              <MaterialReactTable columns={columns} data={usersData} />
              {/* <DataGridComponent rows={usersData} columns={columns} /> */}
            </>
          )}
        </Box>
      </Paper>
      <SpeedialComponent
        handleCloseSpeedial={handleCloseSpeedial}
        handleOpenSpeedial={handleOpenSpeedial}
        handleAction={handleAction}
        actions={actions}
        open={open}
      />
    </Box>
  );
};

export default Users;

const roleBox = [{ label: "Admin" }, { label: "Endcoder" }];
