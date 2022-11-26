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
  Autocomplete,
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

import { fDate } from "../../../utils/formatTime";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import { GRID_CHECKBOX_SELECTION_COL_DEF, trTR } from "@mui/x-data-grid";
import AutocompleteComponent from "../../../components/form/AutocompleteComponent";
import SpeedialComponent from "../../../components/SpeedialComponent";
import { sentenceCase } from "change-case";
import FormInput from "../../../components/form/FormInput";
import Swal from "sweetalert2";
import * as Yup from "yup";
import ImageComponent from "../../../components/image/ImageComponent";
import MaterialReactTable from "material-react-table";
import { values } from "lodash";

import { db_firestore, auth } from "../../../api/firebase";
import {
  addDoc,
  collection,
  setDoc,
  doc,
  getDocs,
  deleteDoc,
} from "@firebase/firestore";
import { createUserWithEmailAndPassword, getAuth } from "@firebase/auth";
import { async } from "@firebase/util";

const actions = [
  {
    icon: <Add />,
    name: "Add",
    operation: "add",
  },
  { icon: <RemoveRedEye />, name: "View", operation: "view" },
  { icon: <Edit />, name: "Edit", operation: "edit" },
  { icon: <Delete />, name: "Delete", operation: "delete" },
];

const Users = ({ setSelectedLink, link }) => {
  const nameRef = useRef();
  const emailRef = useRef();
  const usernameRef = useRef();
  const passwordRef = useRef();
  const phoneNumberRef = useRef();

  const [usersData, setUsersData] = useState([{}]);
  const [roleValue, setRoleValue] = useState(null);
  const [statusValue, setStatusValue] = useState(null);
  const [optionsValue, setOptionsValue] = useState(null);
  const [open, setOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  // const handleOpenSpeedial = (e) => {
  //   setOpen(true);
  // };
  // const handleCloseSpeedial = (e) => {
  //   setOpen(false);
  // };

  const {
    state: { openLogin, loading, user },
    dispatch,
  } = useValue();

  const handleClose = () => {
    dispatch({ type: "CLOSE_LOGIN" });
    dispatch({ type: "RESET_USER" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(user);

    try {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, user.email, user.password)
        .then((userCredential) => {
          const uid = userCredential.user.uid;
          setDoc(doc(db_firestore, "users", uid), {
            id: uid,
            email: user.email,
            // file: user.file,
            name: user.name,
            password: user.password,
            phoneNumber: user.phoneNumber,
            photoUrl: user.photoUrl,
            role: user.role,
            status: user.role,
          }).then((result) => {
            Swal.fire({
              text: "Successfully Save",
              icon: "success",
              confirmButtonText: "OK",
            });
            fetchUsers();
            handleClose();
          });
        })
        .catch((e) => {
          const textMessage = e.code;
          Swal.fire({
            text: textMessage.split("/").pop(),
            icon: "error",
            confirmButtonText: "OK",
          });
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleAction = (e) => {
    if (e === "add") {
      dispatch({ type: "OPEN_LOGIN" });
    }
    if (e === "view") {
      dispatch({ type: "OPEN_LOGIN" });
    }
    if (e === "edit") {
      // dispatch({ type: "OPEN_LOGIN" });
      // const docRef = doc(db, "cities", "SF");
      // const docSnap = getDoc(docRef);
      // if (docSnap.exists()) {
      //   console.log("Document data:", docSnap.data());
      // } else {
      //   // doc.data() will be undefined in this case
      //   console.log("No such document!");
      // }
      // console.log("edit", (user.name = "Diasan"));
    }
    if (e === "delete") {
      console.log(JSON.stringify(rowSelection));
      const rowUserId = convertUserId();
      try {
        deleteDoc(doc(db_firestore, "users", rowUserId));
        fetchUsers();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const convertUserId = () => {
    const obj = JSON.stringify(rowSelection);
    const rowUserId = obj.substring(obj.indexOf(`"`) + 1, obj.lastIndexOf(`"`));
    return rowUserId;
  };

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const photoUrl = URL.createObjectURL(file);
      console.log(photoUrl);
      dispatch({
        type: "UPDATE_USER",
        payload: { ...user, file, photoUrl },
      });
    }
  };

  const handleChange = (e) => {
    dispatch({
      type: "UPDATE_USER",
      payload: { [e.target.id]: e.target.value },
    });
  };

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
    // { accessorKey: "username", header: "Password" },
    { accessorKey: "phoneNumber", header: "Phone Number" },
    { accessorKey: "status", header: "Status" },
    { accessorKey: "role", header: "Role" },
  ]);

  const handleChangeAutoComplete = (e, newValue) => {
    setRoleValue(newValue.label);
    const str = e.target.id;

    const newStr = str.split("-")[0];
    console.log(newValue);

    dispatch({
      type: "UPDATE_USER",
      payload: { [newStr]: newValue.label },
    });
  };

  const fetchUsers = async () => {
    try {
      dispatch({ type: "START_LOADING" });
      const list = [];
      const querySnapshot = await getDocs(collection(db_firestore, "users"));

      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data().email);
        // console.log("doc data:", doc.data());

        list.push({
          id: doc.data().id,
          name: doc.data().name,
          email: doc.data().email,
          // password: doc.data().password,
          phoneNumber: doc.data().phoneNumber,
          status: doc.data().status,
          role: doc.data().role,
        });
      });

      setUsersData(list);
      dispatch({ type: "END_LOADING" });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setSelectedLink(link);

    fetchUsers();
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

          <form onSubmit={handleSubmit}>
            <DialogContent dividers>
              <DialogContentText>
                Please fill user information in the fields :
              </DialogContentText>
              <Grid container>
                <Grid item>
                  <label htmlFor="profilePhoto">
                    <input
                      accept="image/*"
                      id="profilePhoto"
                      type="file"
                      style={{ display: "none" }}
                      onChange={handleChangeImage}
                    />
                    <Avatar
                      src={user.photoUrl}
                      sx={{ width: 250, height: 250, cursor: "pointer" }}
                    />
                  </label>
                </Grid>

                <FormInput
                  required
                  fullWidth
                  type="text"
                  id="name"
                  label="Name"
                  name="name"
                  onChange={handleChange}
                  value={user.name}
                  inputRef={nameRef}
                />
                <FormInput
                  required
                  fullWidth
                  type="email"
                  id="email"
                  label="email"
                  name="email"
                  onChange={handleChange}
                  value={user.email}
                  inputRef={emailRef}
                />
                <FormInput
                  required
                  fullWidth
                  type="password"
                  id="password"
                  label="Password"
                  name="password"
                  onChange={handleChange}
                  value={user.password}
                  inputRef={passwordRef}
                />
                <FormInput
                  required
                  fullWidth
                  type="phoneNumber"
                  id="phoneNumber"
                  label="phoneNumber"
                  name="phoneNumber"
                  onChange={handleChange}
                  value={user.phoneNumber}
                  inputRef={phoneNumberRef}
                />
                <Grid item xs={6} sm={6} p={1}>
                  <Autocomplete
                    options={roleBox}
                    renderInput={(params) => (
                      <TextField {...params} label="Role" />
                    )}
                    value={user.role ? user.role : roleValue}
                    onChange={(e, newValue) =>
                      handleChangeAutoComplete(e, newValue)
                    }
                    disablePortal
                    id="role"
                  />
                </Grid>
                <Grid item xs={6} sm={6} p={1}>
                  <Autocomplete
                    options={statusOption}
                    renderInput={(params) => (
                      <TextField {...params} label="Status" />
                    )}
                    value={user.status ? user.status : statusValue}
                    onChange={(e, newValue) => (e, newValue)}
                    disablePortal
                    id="status"
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ px: "19px" }}>
              <Button
                type="submit"
                variant="contained"
                color="success"
                endIcon={<SaveOutlined />}
              >
                Save
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        <Box m={2}>
          {loading ? (
            <CircularProgress color="secondary" />
          ) : (
            <>
              <MaterialReactTable
                columns={columns}
                data={usersData}
                initialState={{ columnVisibility: { id: false } }}
                getRowId={(row) => row.id}
                muiTableBodyRowProps={({ row }) => ({
                  //implement row selection click events manually
                  onClick: () =>
                    setRowSelection((prev) => ({
                      [row.id]: !prev[row.id],
                    })),
                  selected: rowSelection[row.id],
                  sx: {
                    cursor: "pointer",
                  },
                })}
                state={{ rowSelection }}
              />
              {/* <DataGridComponent rows={usersData} columns={columns} /> */}
            </>
          )}
        </Box>
      </Paper>
      <SpeedialComponent
        // handleCloseSpeedial={handleCloseSpeedial}
        // handleOpenSpeedial={handleOpenSpeedial}
        handleAction={handleAction}
        actions={actions}

        // open={open}
      />
    </Box>
  );
};

export default Users;

const roleBox = [{ label: "Admin" }, { label: "Endcoder" }];

const statusOption = [{ label: "Active" }, { label: "Banned" }];
