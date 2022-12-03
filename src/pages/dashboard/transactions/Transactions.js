import { Close, Delete, Edit, Send } from "@mui/icons-material";
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
import { useEffect, useRef } from "react";
import DataGridComponent from "../../../components/dataGrid/DataGridComponent";
import FormInput from "../../../components/form/FormInput";
import SpeedialComponent from "../../../components/SpeedialComponent";
import { useValue } from "../../../context/ContextProvider";
import { transactionsData } from "../../../data";
import { fDate } from "../../../utils/formatTime";

const Transactions = ({ setSelectedLink, link }) => {
  const productNameRef = useRef();
  const customerNameRef = useRef();
  const amountRef = useRef();
  const transactionDescriptionRef = useRef();
  const transactionDateRef = useRef();
  const transactionTypeRef = useRef();

  const {
    state: { openLogin, loading },
    dispatch,
  } = useValue();

  const handleClose = () => {
    dispatch({ type: "CLOSE_LOGIN" });
  };

  const handleAction = async (e) => {
    console.log(e);
    if (e === "add") {
      dispatch({ type: "OPEN_LOGIN" });
    }

    if (e === "edit") {
      // const rowUserId = convertUserId();
      // const docRef = doc(db_firestore, "transactions", rowUserId);
      // const docSnap = await getDoc(docRef);
      // console.log(docSnap);
      // if (docSnap.exists()) {
      //   // employee.id = docSnap.data().id;
      //   dispatch({ type: "OPEN_LOGIN" });
      // } else {
      //   // doc.data() will be undefined in this case
      //   console.log("No such document!");
      // }
    }

    if (e === "delete") {
      // const rowUserId = convertUserId();
      // try {
      //   deleteDoc(doc(db_firestore, "transactions", rowUserId));
      // } catch (error) {
      //   console.log(error);
      // }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 1, hide: true },

    { field: "productName", headerName: "Product Name", minWidth: 250 },
    { field: "customerName", headerName: "Customer Name", minWidth: 250 },
    { field: "amount", headerName: "Amount", minWidth: 150 },
    { field: "transactionType", headerName: "Transaction Type", minWidth: 150 },
    {
      field: "transactionDescription",
      headerName: "Description",
      minWidth: 200,
    },
    {
      field: "transactionDate",
      headerName: "Transaction Date",
      minWidth: 150,
      renderCell: (params) => {
        return (
          <>
            <Typography>{fDate(params.value)}</Typography>
          </>
        );
      },
    },
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
          <Typography variant="h5">Transaction List</Typography>
        </Stack>
        <Dialog open={openLogin} onClose={handleClose} fullWidth maxWidth="lg">
          <DialogTitle>
            Transaction Information
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
                <FormInput
                  autoFocus
                  id="productName"
                  label="Product Name"
                  type="text"
                  sx={12}
                  sm={12}
                />
                <FormInput
                  id="customerName"
                  label="Customer Name"
                  type="text"
                  sx={12}
                  sm={12}
                />
                <FormInput id="amount" label="Amount" type="number" />
                <FormInput
                  id="transactionType"
                  label="Transaction Type"
                  type="text"
                  sx={12}
                  sm={12}
                />
                <FormInput
                  id="transactionDescription"
                  label="Transaction Description"
                  type="text"
                  sx={12}
                  sm={12}
                />
                <FormInput
                  margin="normal"
                  id="transactionDate"
                  label="Transaction Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
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
              <DataGridComponent rows={transactionsData} columns={columns} />
            </>
          )}
        </Box>
      </Paper>
      <SpeedialComponent handleAction={handleAction} />
    </Box>
  );
};

export default Transactions;
