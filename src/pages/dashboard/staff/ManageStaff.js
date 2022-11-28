import { async } from "@firebase/util";
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
import React, { useEffect, useMemo, useRef, useState } from "react";
import DataGridComponent from "../../../components/dataGrid/DataGridComponent";
import DialogComponent from "../../../components/form/DialogComponent";
import SpeedialComponent from "../../../components/SpeedialComponent";
import { useValue } from "../../../context/ContextProvider";
import { employeeData } from "../../../data";
import { fDate } from "../../../utils/formatTime";
import MaterialReactTable from "material-react-table";
import {
  addDoc,
  collection,
  setDoc,
  doc,
  getDocs,
  deleteDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "@firebase/firestore";
import { db_firestore } from "../../../api/firebase";
import Swal from "sweetalert2";

const ManageStaff = ({ setSelectedLink, link }) => {
  //   console.log(employeeData);
  const [employeesData, setEmployeesData] = useState([{}]);
  const [rowSelection, setRowSelection] = useState({});

  const {
    state: { openLogin, employee, loading },
    dispatch,
  } = useValue();

  const handleClose = () => {
    dispatch({ type: "RESET_EMPLOYEE" });
    dispatch({ type: "CLOSE_LOGIN" });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(employee.id);
    if (employee.id) {
      handleUpdate();
    } else {
      handleSave();
    }
  };

  const handleSave = async () => {
    try {
      await addDoc(collection(db_firestore, "employees"), {
        id: employee.id,
        avatarUrl: employee.avatarUrl,
        name: employee.name,
        email: employee.email,
        position: employee.position,
        address: employee.address,
        phoneNumber: employee.phoneNumber,
        sex: employee.sex,
        birthdate: employee.birthdate,
        salary: employee.salary,
      })
        .then((data) => {
          const docRef = doc(db_firestore, "employees", data.id);
          updateDoc(docRef, {
            id: data.id,
          });
        })
        .finally((result) => {
          Swal.fire({
            text: "Successfully Save",
            icon: "success",
            confirmButtonText: "OK",
          });
          fetchEmployeeList();
          handleClose();
        })
        .catch((e) => {
          const textMessage = e.code;
          Swal.fire({
            text: textMessage.split("/").pop(),
            icon: "error",
            confirmButtonText: "OK",
          });
        });
    } catch (error) {}
  };

  const handleUpdate = async () => {
    try {
      const rowUserId = convertUserId();
      const washingtonRef = doc(db_firestore, "employees", rowUserId);

      await updateDoc(washingtonRef, {
        avatarUrl: employee.avatarUrl,
        name: employee.name,
        email: employee.email,
        position: employee.position,
        address: employee.address,
        phoneNumber: employee.phoneNumber,
        sex: employee.sex,
        birthdate: employee.birthdate,
        salary: employee.salary,
      })
        .then((result) => {
          Swal.fire({
            text: "Successfully Save",
            icon: "success",
            confirmButtonText: "OK",
          });
          fetchEmployeeList();
          handleClose();
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

  const convertUserId = () => {
    const obj = JSON.stringify(rowSelection);
    const rowUserId = obj.substring(obj.indexOf(`"`) + 1, obj.lastIndexOf(`"`));
    return rowUserId;
  };

  const handleAction = async (e) => {
    console.log(e);
    if (e === "add") {
      dispatch({ type: "OPEN_LOGIN" });
    }

    if (e === "edit") {
      const rowUserId = convertUserId();
      const docRef = doc(db_firestore, "employees", rowUserId);
      const docSnap = await getDoc(docRef);
      console.log(docSnap);
      if (docSnap.exists()) {
        employee.id = docSnap.data().id;
        employee.avatarUrl = docSnap.data().avatarUrl;
        employee.name = docSnap.data().name;
        employee.email = docSnap.data().email;
        employee.position = docSnap.data().position;
        employee.address = docSnap.data().address;
        employee.phoneNumber = docSnap.data().phoneNumber;
        employee.sex = docSnap.data().sex;
        employee.birthdate = docSnap.data().birthdate;
        employee.salary = docSnap.data().salary;
        dispatch({ type: "OPEN_LOGIN" });
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }

    if (e === "delete") {
      const rowUserId = convertUserId();

      try {
        deleteDoc(doc(db_firestore, "employees", rowUserId));
        fetchEmployeeList();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleChange = (e) => {
    dispatch({
      type: "UPDATE_EMPLOYEE",
      payload: { [e.target.id]: e.target.value },
    });
  };

  const fetchEmployeeList = async () => {
    try {
      dispatch({ type: "START_LOADING" });
      const list = [];
      const querySnapshot = await getDocs(
        collection(db_firestore, "employees")
      );

      querySnapshot.forEach((doc) => {
        list.push({
          id: doc.data().id,
          avatarUrl: doc.data().avatarUrl,
          name: doc.data().name,
          email: doc.data().email,
          position: doc.data().position,
          address: doc.data().address,
          phoneNumber: doc.data().phoneNumber,
          sex: doc.data().sex,
          birthdate: doc.data().birthdate,
          salary: doc.data().salary,
        });
      });

      setEmployeesData(list);
      dispatch({ type: "END_LOADING" });
    } catch (error) {
      console.log(error);
    }
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
    { accessorKey: "email", header: "Email Address" },

    { accessorKey: "position", header: "Position" },
    { accessorKey: "address", header: "Address" },
    { accessorKey: "phoneNumber", header: "Phone Number" },
    { accessorKey: "sex", header: "Sex" },
    // { accessorKey: "birthdate", header: "Birthdate" },
    { accessorKey: "salary", header: "Salary" },
  ]);

  const inputs = [
    {
      autoFocus: true,
      id: "name",
      name: "name",
      label: "Full Name",
      value: employee.name,
      type: "text",
      xs: 12,
      sm: 6,
    },
    {
      id: "email",
      name: "email",
      label: "Email Address",
      value: employee.email,
      type: "email",
      xs: 12,
      sm: 6,
      required: false,
    },
    {
      id: "address",
      name: "address",
      label: "Address",
      value: employee.address,
      type: "text",
      xs: 12,
      sm: 12,
    },
    {
      id: "position",
      name: "position",
      label: "Position",
      value: employee.position,
      type: "text",
      xs: 12,
      sm: 6,
    },
    {
      id: "phoneNumber",
      name: "phoneNumber",
      label: "Phone#",
      value: employee.phoneNumber,
      type: "number",
      xs: 12,
      sm: 6,
    },
    {
      id: "sex",
      name: "sex",
      label: "Sex",
      value: employee.sex,
      type: "text",
      xs: 12,
      sm: 4,
    },
    {
      id: "birthdate",
      name: "birthdate",
      label: "Birthdate",
      value: employee.birthdate,
      InputLabelProps: { shrink: true },
      type: "date",
      xs: 12,
      sm: 4,
    },
    {
      id: "salary",
      name: "salary",
      label: "Salary",
      value: employee.salary,
      type: "number",
      xs: 12,
      sm: 4,
    },
  ];

  useEffect(() => {
    setSelectedLink(link);
    fetchEmployeeList();
  }, []);
  return (
    <Box display="flex" flexDirection="column">
      <Paper elevation={3}>
        <Stack direction="row" spacing={2} m={3} justifyContent="space-between">
          <Typography variant="h5">Employee List</Typography>
        </Stack>

        <DialogComponent
          open={openLogin}
          handleClose={handleClose}
          title="Employee Information"
          inputs={inputs}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
        />

        <Box m={2}>
          {loading ? (
            <CircularProgress color="secondary" />
          ) : (
            <>
              <MaterialReactTable
                columns={columns}
                data={employeesData}
                initialState={{ columnVisibility: { id: false } }}
                getRowId={(row) => row.id}
                muiTableBodyRowProps={({ row }) => ({
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
            </>
          )}
        </Box>
        <SpeedialComponent handleAction={handleAction} />
      </Paper>
    </Box>
  );
};
export default ManageStaff;
