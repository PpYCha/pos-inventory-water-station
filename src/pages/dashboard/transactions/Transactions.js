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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
import InvoiceComponent from "../../../components/InvoiceComponent";
import InvoiceDialogComponent from "../../../components/InvoiceDialogComponent";

const Transactions = ({ setSelectedLink, link }) => {
  const [transactionList, setTransactionList] = useState([{}]);
  const [rowSelection, setRowSelection] = useState({});
  const [amount, setAmount] = useState();

  const {
    state: { openLogin, loading, customerInvoice },
    dispatch,
  } = useValue();

  const handleClose = () => {
    dispatch({ type: "CLOSE_LOGIN" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleDoubleClick = (e) => {
    fetchSpecificTransaction();

    console.log(customerInvoice);
  };

  const fetchSpecificTransaction = async () => {
    let docSnap;
    const obj = JSON.stringify(rowSelection);
    const rowUserId = obj.substring(obj.indexOf(`"`) + 1, obj.lastIndexOf(`"`));
    console.log("id:", rowUserId);
    const docRef = doc(db_firestore, "transactions", rowUserId);
    docSnap = await getDoc(docRef);

    if (docSnap && docSnap.exists()) {
      customerInvoice.cart = docSnap.data().cart;
      customerInvoice.date = docSnap.data().date;
      customerInvoice.time = docSnap.data().time;
      customerInvoice.subTotal = docSnap.data().subTotal;
      customerInvoice.tax = docSnap.data().tax;
      customerInvoice.total = docSnap.data().total;

      dispatch({ type: "OPEN_LOGIN" });
    } else {
      console.log("No such document!");
    }
  };

  const columns = useMemo(() => [
    {
      accessorKey: "id",
      header: "Invoice ID",
    },

    // { accessorKey: "amount", header: "Amount" },
    // { accessorKey: "taxRate", header: "Tax Rate" },
    // { accessorKey: "tax", header: "Tax" },
    { accessorKey: "total", header: "Total" },
    { accessorKey: "date", header: "Date" },
    { accessorKey: "time", header: "Time" },
  ]);

  const fetchTransactionList = async () => {
    try {
      dispatch({ type: "START_LOADING" });
      const list = [];
      const querySnapshot = await getDocs(
        collection(db_firestore, "transactions")
      );

      querySnapshot.forEach((doc) => {
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

  useEffect(() => {
    setSelectedLink(link);
    fetchTransactionList();
  }, []);

  return (
    <Box display="flex" flexDirection="column">
      <Paper elevation={3}>
        <Stack direction="row" spacing={2} m={3} justifyContent="space-between">
          <Typography variant="h5">Transaction List</Typography>
        </Stack>
        {/* Start Dialog */}
        <InvoiceDialogComponent
          openLogin={openLogin}
          handleClose={handleClose}
        />
        {/* End Dialog */}
        <Box m={2}>
          {loading ? (
            <CircularProgress color="secondary" />
          ) : (
            <>
              <>
                <MaterialReactTable
                  columns={columns}
                  data={transactionList}
                  initialState={{ columnVisibility: { id: true } }}
                  getRowId={(row) => row.id}
                  muiTableBodyCellProps={({ cell }) => ({
                    onDoubleClick: handleDoubleClick,
                  })}
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
