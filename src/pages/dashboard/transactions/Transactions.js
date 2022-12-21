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

const Transactions = ({ setSelectedLink, link }) => {
  const [transactionList, setTransactionList] = useState([{}]);

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
      header: "Invoice ID",
    },

    { accessorKey: "amount", header: "Amount" },
    { accessorKey: "taxRate", header: "Tax Rate" },
    { accessorKey: "tax", header: "Tax" },
    { accessorKey: "total", header: "Total" },
    { accessorKey: "date", header: "Date" },
    { accessorKey: "time", header: "Time" },
  ]);

  useEffect(() => {
    setSelectedLink(link);
    fetchTransactionList();
  }, []);

  const fetchTransactionList = async () => {
    try {
      dispatch({ type: "START_LOADING" });
      const list = [];
      const querySnapshot = await getDocs(
        collection(db_firestore, "transactions")
      );
      console.log(querySnapshot);
      querySnapshot.forEach((doc) => {
        console.log(doc.id);
        list.push({
          id: doc.id,
          amount: doc.data().amount,

          taxRate: doc.data().taxRate,
          tax: doc.data().tax,
          total: doc.data().total,
          date: doc.data().date,
          time: doc.data().time,
        });
      });

      setTransactionList(list);
      dispatch({ type: "END_LOADING" });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box display="flex" flexDirection="column">
      <Paper elevation={3}>
        <Stack direction="row" spacing={2} m={3} justifyContent="space-between">
          <Typography variant="h5">Transaction List</Typography>
        </Stack>

        <Box m={2}>
          {loading ? (
            <CircularProgress color="secondary" />
          ) : (
            <>
              <>
                <MaterialReactTable
                  columns={columns}
                  data={transactionList}
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

export default Transactions;
