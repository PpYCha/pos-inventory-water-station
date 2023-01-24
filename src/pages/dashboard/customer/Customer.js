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
import Swal from "sweetalert2";
import DataGridComponent from "../../../components/dataGrid/DataGridComponent";
import SpeedialComponent from "../../../components/SpeedialComponent";
import { useValue } from "../../../context/ContextProvider";
import { customerData } from "../../../data";
import { fDate } from "../../../utils/formatTime";
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
import DialogComponent from "../../../components/form/DialogComponent";
import MaterialReactTable from "material-react-table";
import { getImageUrl, uploadImage } from "../../../utils/uploadImage";

const Customer = ({ setSelectedLink, link }) => {
  const [customersData, setCustomersData] = useState([{}]);
  const [rowSelection, setRowSelection] = useState({});

  const {
    state: { openLogin, loading, customer },
    dispatch,
  } = useValue();

  const handleClose = () => {
    dispatch({ type: "RESET_CUSTOMER" });
    dispatch({ type: "CLOSE_LOGIN" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(customer);

    if (customer.id) {
      handleUpdate();
    } else {
      handleSave();
    }
  };

  const handleSave = async () => {
    try {
      let url;
      if (customer.file) {
        const imageRef = await uploadImage(
          "images/customers/profile",
          customer.file
        );
        url = await getImageUrl(imageRef);
      }

      await addDoc(collection(db_firestore, "customers"), {
        id: customer.id,
        avatarUrl: url || null,
        name: customer.name,
        email: customer.email,
        address: customer.address,
        phoneNumber: customer.phoneNumber,
        birthdate: customer.birthdate,
        sex: customer.sex,
        ordered: customer.ordered,
        debit: customer.debit,
      })
        .then((data) => {
          const docRef = doc(db_firestore, "customers", data.id);
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
          fetchCustomerList();
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
      const washingtonRef = doc(db_firestore, "customers", rowUserId);

      let url;
      if (customer.file) {
        const imageRef = await uploadImage(
          "images/customers/profile",
          customer.file
        );
        url = await getImageUrl(imageRef);
      }

      await updateDoc(washingtonRef, {
        id: customer.id,
        avatarUrl: url || customer.avatarUrl,
        name: customer.name,
        email: customer.email,
        address: customer.address,
        phoneNumber: customer.phoneNumber,
        birthdate: customer.birthdate,
        sex: customer.sex,
        ordered: customer.ordered,
        debit: customer.debit,
      })
        .then((result) => {
          Swal.fire({
            text: "Successfully Save",
            icon: "success",
            confirmButtonText: "OK",
          });
          fetchCustomerList();
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
    // console.log(e);
    if (e === "add") {
      dispatch({ type: "OPEN_LOGIN" });
    }

    if (e === "edit") {
      const rowUserId = convertUserId();
      const docRef = doc(db_firestore, "customers", rowUserId);
      const docSnap = await getDoc(docRef);
      console.log(docSnap);
      if (docSnap.exists()) {
        customer.id = docSnap.data().id;
        customer.avatarUrl = docSnap.data().avatarUrl;
        customer.name = docSnap.data().name;
        customer.email = docSnap.data().email;
        customer.address = docSnap.data().address;
        customer.phoneNumber = docSnap.data().phoneNumber;
        // customer.birthdate = docSnap.data().birthdate;
        // customer.sex = docSnap.data().sex;
        if (docSnap.data().birthdate !== null) {
          customer.birthdate = docSnap.data().birthdate;
        }
        if (docSnap.data().sex !== null) {
          customer.sex = docSnap.data().sex;
        }
        customer.ordered = docSnap.data().ordered;
        customer.debit = docSnap.data().debit;
        dispatch({ type: "OPEN_LOGIN" });
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }

    if (e === "delete") {
      Swal.fire({
        title: "Do you want to delete the cutomer?",
        showDenyButton: true,
        confirmButtonText: "Yes",
        denyButtonText: `No`,
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire("Deleted!", "", "success");

          const rowUserId = convertUserId();
          try {
            deleteDoc(doc(db_firestore, "customers", rowUserId));
            fetchCustomerList();
          } catch (error) {
            console.log(error);
          }
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });
    }
  };

  const handleChange = (e) => {
    dispatch({
      type: "UPDATE_CUSTOMER",
      payload: { [e.target.id]: e.target.value },
    });
  };

  const fetchCustomerList = async () => {
    try {
      dispatch({ type: "START_LOADING" });
      const list = [];
      const querySnapshot = await getDocs(
        collection(db_firestore, "customers")
      );

      querySnapshot.forEach((doc) => {
        list.push({
          id: doc.data().id,
          avatarUrl: doc.data().avatarUrl,
          name: doc.data().name,
          email: doc.data().email,
          address: doc.data().address,
          phoneNumber: doc.data().phoneNumber,
          birthdate: doc.data().birthdate,
          sex: doc.data().sex,
          ordered: doc.data().ordered,
          debit: doc.data().debit,
        });
      });

      setCustomersData(list);
      dispatch({ type: "END_LOADING" });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const avatarUrl = URL.createObjectURL(file);
      console.log(avatarUrl);
      dispatch({
        type: "UPDATE_CUSTOMER",
        payload: { ...customer, file, avatarUrl },
      });
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

    { accessorKey: "address", header: "Address" },
    { accessorKey: "phoneNumber", header: "Phone Number" },
    { accessorKey: "birthdate", header: "Birthdate" },
    { accessorKey: "sex", header: "Sex" },
    { accessorKey: "ordered", header: "Ordered" },
    { accessorKey: "debit", header: "Debit" },
  ]);

  const inputs = [
    {
      autoFocus: true,

      id: "name",
      name: "name",
      label: "Full Name",
      value: customer.name,
      type: "text",
      xs: 12,
      sm: 6,
    },
    {
      id: "email",
      name: "email",
      label: "Email Address",
      value: customer.email,
      type: "email",
      xs: 12,
      sm: 6,
    },
    {
      id: "address",
      name: "address",
      label: "Address",
      value: customer.address,
      type: "text",
      xs: 12,
      sm: 12,
    },
    {
      id: "phoneNumber",
      label: "Phone Number",
      value: customer.phoneNumber,
      type: "text",
      xs: 12,
      sm: 4,
    },
    {
      id: "birthdate",
      label: "Birthdate",
      value: customer.birthdate,
      type: "date",
      InputLabelProps: { shrink: true },
      xs: 12,
      sm: 4,
      required: false,
    },
    {
      id: "sex",
      label: "Sex",
      value: customer.sex,
      type: "text",
      xs: 12,
      sm: 4,
      required: false,
    },
    {
      id: "ordered",
      label: "Ordered",
      value: customer.ordered,
      type: "number",
      xs: 12,
      sm: 6,
    },
    {
      id: "debit",
      label: "Debit",
      value: customer.debit,
      type: "number",
      xs: 12,
      sm: 6,
    },
  ];

  useEffect(() => {
    setSelectedLink(link);
    fetchCustomerList();
  }, []);

  return (
    <Box display="flex" flexDirection="column">
      <Paper elevation={3}>
        <Stack direction="row" spacing={2} m={3} justifyContent="space-between">
          <Typography variant="h5">Customer List</Typography>
        </Stack>

        <DialogComponent
          open={openLogin}
          handleClose={handleClose}
          title="Customer Information"
          inputs={inputs}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          handleChangeImage={handleChangeImage}
          imgSrc={customer.avatarUrl || null}
          profilePicture={true}
        />

        <Box m={2}>
          {loading ? (
            <CircularProgress color="secondary" />
          ) : (
            <>
              <MaterialReactTable
                columns={columns}
                data={customersData}
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

export default Customer;
