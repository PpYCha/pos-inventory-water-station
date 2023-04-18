import { Close, Delete, Edit, FileDownload, Send } from "@mui/icons-material";
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
  toDate,
} from "@firebase/firestore";
import { db_firestore } from "../../../api/firebase";
import InvoiceComponent from "../../../components/InvoiceComponent";
import InvoiceDialogComponent from "../../../components/InvoiceDialogComponent";
import { ExportToCsv } from "export-to-csv";

const Transactions = ({ setSelectedLink, link }) => {
  const [transactionList, setTransactionList] = useState([{}]);
  const [rowSelection, setRowSelection] = useState({});
  const [amount, setAmount] = useState();

  const {
    state: { openLogin, loading, customerInvoice, openInvoice },
    dispatch,
  } = useValue();

  const handleClose = () => {
    dispatch({ type: "CLOSE_INVOICE" });
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
      let date = docSnap.data().date.toDate();
      let dateString = date.toISOString().substring(0, 10);

      customerInvoice.cart = docSnap.data().cart;
      customerInvoice.date = dateString;
      customerInvoice.time = docSnap.data().time;
      customerInvoice.subTotal = docSnap.data().subTotal;
      customerInvoice.tax = docSnap.data().tax;
      customerInvoice.total = docSnap.data().total;

      dispatch({ type: "OPEN_INVOICE" });
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
    { accessorKey: "paid", header: "Paid" },
    { accessorKey: "date", header: "Date" },
    {
      accessorKey: "time",
      header: "Time",
    },
  ]);

  const fetchTransactionList = async () => {
    try {
      dispatch({ type: "START_LOADING" });
      const list = [];
      const querySnapshot = await getDocs(
        collection(db_firestore, "transactions")
      );

      let date;
      let dateString;

      querySnapshot.forEach((doc) => {
        date = doc.data().date.toDate();
        dateString = date.toISOString().substring(0, 10);

        list.push({
          id: doc.data().inVoiceId,
          amount: doc.data().amount,

          taxRate: doc.data().taxRate,
          tax: doc.data().tax,
          total: doc.data().total,
          date: dateString,
          time: convertTo12Hour(doc.data().time),
          paid: doc.data().paid,
        });
      });
      list.sort((a, b) => a.id - b.id);
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

  const handleExportData = () => {
    const transactionExport = transactionList.map((item) => {
      return {
        id: item.id,
        total: item.total,
        paid: item.paid,
        date: item.date,
        time: item.time,
      };
    });
    console.log(transactionExport);
    csvExporter.generateCsv(transactionExport);
  };

  const csvOptions = {
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalSeparator: ".",
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: columns.map((c) => c.header),
  };

  const csvExporter = new ExportToCsv(csvOptions);

  return (
    <Box display="flex" flexDirection="column">
      <Paper elevation={3}>
        <Stack direction="row" spacing={2} m={3} justifyContent="space-between">
          <Typography variant="h5">Sales List</Typography>
        </Stack>
        {/* Start Dialog */}
        <InvoiceDialogComponent
          openLogin={openInvoice}
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
                  renderTopToolbarCustomActions={({ table }) => (
                    <Box
                      sx={{
                        display: "flex",
                        gap: "1rem",
                        p: "0.5rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <Button
                        color="primary"
                        onClick={handleExportData}
                        startIcon={<FileDownload />}
                        variant="contained"
                      >
                        Export Sales
                      </Button>
                    </Box>
                  )}
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
