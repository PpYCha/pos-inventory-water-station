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
import { useEffect, useMemo, useRef, useState } from "react";
import DataGridComponent from "../../../components/dataGrid/DataGridComponent";
import FormInput from "../../../components/form/FormInput";
import SpeedialComponent from "../../../components/SpeedialComponent";
import { useValue } from "../../../context/ContextProvider";
import { transactionsData, usersDatass } from "../../../data";
import { convertTo12Hour, fDate } from "../../../utils/formatTime";
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

const Stock = ({ setSelectedLink, link }) => {
  const [stockList, setStockList] = useState([{}]);

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

  const columns = useMemo(() => [
    {
      accessorKey: "id",
      header: "Index",
    },
    {
      accessorKey: "transactId",
      header: "Invoice ID",
    },

    { accessorKey: "productName", header: "Product Name" },
    {
      accessorKey: "qty",
      header: "Quantity In/Out",
      Cell: ({ row }) => (
        <>
          <Typography> - {row.original.qty}</Typography>
        </>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      Cell: ({ row }) => (
        <>
          <Typography>₱ {row.original.price}</Typography>
        </>
      ),
    },
    {
      accessorKey: "total",
      header: "Total",
      Cell: ({ cell, row }) => (
        <>
          <Typography>₱ {row.original.qty * row.original.price}</Typography>
        </>
      ),
    },
    { accessorKey: "date", header: "Date" },
    {
      accessorKey: "time",
      header: "Time",
    },
  ]);

  useEffect(() => {
    setSelectedLink(link);
    fetchStockList();
  }, []);

  const fetchStockList = async () => {
    try {
      dispatch({ type: "START_LOADING" });
      const list = [];
      const querySnapshot = await getDocs(
        collection(db_firestore, "transactions")
      );

      let cartList;
      let date;
      let dateString;
      let inVoiceId;

      querySnapshot.forEach((doc) => {
        cartList = doc.data().cart;
        date = doc.data().date.toDate();
        dateString = date.toISOString().substring(0, 10);
        inVoiceId = doc.data().inVoiceId;
        cartList.forEach((item, index) => {
          list.push({
            transactId: inVoiceId,
            productName: item.productName,
            qty: item.qty,
            price: item.price,

            date: dateString,
            time: convertTo12Hour(doc.data().time),
          });
        });
      });

      setStockList(list);
      dispatch({ type: "END_LOADING" });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box display="flex" flexDirection="column">
      <Paper elevation={3}>
        <Stack direction="row" spacing={2} m={3} justifyContent="space-between">
          <Typography variant="h5">Inventory Log</Typography>
        </Stack>

        <Box m={2}>
          {loading ? (
            <CircularProgress color="secondary" />
          ) : (
            <>
              <>
                <MaterialReactTable
                  columns={columns}
                  data={stockList}
                  initialState={{ columnVisibility: { id: false } }}
                  getRowId={(row) => row.id}
                />
              </>
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Stock;
