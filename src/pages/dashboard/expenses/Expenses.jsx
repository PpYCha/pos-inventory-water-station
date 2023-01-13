import {
  Add,
  Close,
  Delete,
  Edit,
  RemoveRedEye,
  Send,
} from "@mui/icons-material";
import {
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
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import DataGridComponent from "../../../components/dataGrid/DataGridComponent";
import DialogComponent from "../../../components/form/DialogComponent";
import SpeedialComponent from "../../../components/SpeedialComponent";
import { useValue } from "../../../context/ContextProvider";
import MaterialReactTable from "material-react-table";
import { db_firestore } from "../../../api/firebase";
import noProductImage from "../../../assets/no-image.png";

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
  toDate,
} from "@firebase/firestore";
import Swal from "sweetalert2";
import { async } from "@firebase/util";
import { getImageUrl, uploadImage } from "../../../utils/uploadImage";
import { fDate, fDateTime } from "../../../utils/formatTime";
import LimitedSpeedialComponent from "../../../components/LimitedSpeedialComponent";

const Expenses = ({ setSelectedLink, link }) => {
  const [expenseList, setExpenseList] = useState([{}]);
  const [rowSelection, setRowSelection] = useState({});

  const {
    state: { currentUser, openLogin, product, loading, expense },
    dispatch,
  } = useValue();

  const handleClose = () => {
    console.log("close");
    dispatch({ type: "RESET_EXPENSE" });
    dispatch({ type: "CLOSE_LOGIN" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(product);

    if (product.id) {
      handleUpdate();
    } else {
      handleSave();
    }
  };

  const handleSave = async () => {
    try {
      let date = new Date(Date.parse(expense.date));
      date.setHours(0, 0, 0, 0);

      await addDoc(collection(db_firestore, "expenses"), {
        particular: expense.particular,
        amount: expense.amount,
        date: date,
      })
        .then((result) => {
          Swal.fire({
            text: "Successfully Save",
            icon: "success",
            confirmButtonText: "OK",
          });
          fetchExpenseList();
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

  const handleUpdate = async () => {
    try {
      const rowUserId = convertUserId();
      const washingtonRef = doc(db_firestore, "expenses", rowUserId);

      let date = new Date(Date.parse(expense.date));
      date.setHours(0, 0, 0, 0);

      await updateDoc(washingtonRef, {
        particular: expense.particular,
        amount: expense.amount,
        date: expense.date,
      })
        .then((result) => {
          Swal.fire({
            text: "Successfully Save",
            icon: "success",
            confirmButtonText: "OK",
          });
          fetchExpenseList();
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

  const handleAction = async (e) => {
    if (e === "add") {
      dispatch({ type: "OPEN_LOGIN" });
      return;
    }

    let docSnap;
    if (e === "edit") {
      const rowUserId = convertUserId();
      const docRef = doc(db_firestore, "expenses", rowUserId);
      docSnap = await getDoc(docRef);
    }

    if (docSnap && docSnap.exists()) {
      expense.id = docSnap.data().id;
      expense.particular = docSnap.data().particular;
      expense.amount = docSnap.data().amount;
      expense.date = docSnap.data().date;

      dispatch({ type: "OPEN_LOGIN" });
    } else if (e === "edit") {
      console.log("No such document!");
    }

    if (e === "delete") {
      Swal.fire({
        title: "Do you want to delete the product?",
        showDenyButton: true,
        confirmButtonText: "Yes",
        denyButtonText: `No`,
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire("Deleted!", "", "success");

          const rowUserId = convertUserId();

          console.log(rowUserId);
          try {
            deleteDoc(doc(db_firestore, "expenses", rowUserId));
            fetchExpenseList();
          } catch (error) {
            console.log(error);
          }
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });
    }
  };

  const convertUserId = () => {
    const obj = JSON.stringify(rowSelection);
    const rowUserId = obj.substring(obj.indexOf(`"`) + 1, obj.lastIndexOf(`"`));
    return rowUserId;
  };

  useEffect(() => {
    setSelectedLink(link);
    fetchExpenseList();
  }, []);

  const handleChange = (e) => {
    console.log(e.target.value);
    dispatch({
      type: "UPDATE_EXPENSE",
      payload: { [e.target.id]: e.target.value },
    });
  };

  const fetchExpenseList = async () => {
    try {
      dispatch({ type: "START_LOADING" });
      const list = [];
      const querySnapshot = await getDocs(collection(db_firestore, "expenses"));

      let date;
      let dateString;
      // console.log(dateString); // Output: "YYYY-MM-DD"

      querySnapshot.forEach((doc) => {
        date = doc.data().date.toDate();
        dateString = date.toISOString().substring(0, 10);

        list.push({
          id: doc.id,
          particular: doc.data().particular,
          amount: doc.data().amount,
          date: dateString,
        });
      });

      setExpenseList(list);
      dispatch({ type: "END_LOADING" });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const photoUrl = URL.createObjectURL(file);
      console.log(photoUrl);
      dispatch({
        type: "UPDATE_PRODUCT",
        payload: { ...product, file, photoUrl },
      });
    }
  };

  const columns = useMemo(() => [
    {
      accessorKey: "id",
      header: "ID",
    },
    { accessorKey: "particular", header: "Particular" },
    {
      accessorKey: "amount",
      header: "Expense Amount",
      Cell: ({ cell, row }) => (
        <>
          <Typography>₱ {row.original.amount}</Typography>
        </>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
    },
  ]);

  const inputs = [
    {
      id: "particular",
      name: "particular",
      label: "Particular",
      type: "text",
      required: true,

      value: expense.particular,
      xs: 12,
      sm: 12,
    },
    {
      id: "amount",
      name: "amount",
      label: "Amount",
      value: expense.amount,
      type: "number",
      required: true,
      inputProps: { minLength: 1 },
      xs: 6,
      sm: 6,
    },

    {
      id: "date",
      name: "date",
      label: "Date",
      value: expense.cost,
      type: "date",
      required: true,
      xs: 6,
      sm: 6,
      InputLabelProps: { shrink: true },
    },
  ];

  return (
    <Box display="flex" flexDirection="column">
      <Paper elevation={3}>
        <Stack direction="row" spacing={2} m={3} justifyContent="space-between">
          <Typography variant="h5">Expense List</Typography>
        </Stack>
        <DialogComponent
          open={openLogin}
          handleClose={handleClose}
          title="Expense Information"
          inputs={inputs}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          handleChangeImage={handleChangeImage}
          imgSrc={null}
        />

        <Box m={2}>
          {loading ? (
            <CircularProgress color="secondary" />
          ) : (
            <>
              <MaterialReactTable
                columns={columns}
                data={expenseList}
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
        {currentUser.role === "Admin" ? (
          <SpeedialComponent handleAction={handleAction} />
        ) : (
          <LimitedSpeedialComponent
            handleAction={handleAction}
            actions={actionsEncoderExpenses}
          />
        )}
      </Paper>
    </Box>
  );
};

export default Expenses;

const actionsEncoderExpenses = [
  {
    icon: <Add />,
    name: "Add",
    operation: "add",
  },
  // { icon: <RemoveRedEye />, name: "View", operation: "view" },
];
