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

          <Button
            variant="contained"
            onClick={() => dispatch({ type: "OPEN_LOGIN" })}
          >
            Add New Transaction
          </Button>
        </Stack>
        <Dialog open={openLogin} onClose={handleClose}>
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
                <TextField
                  autoFocus
                  margin="normal"
                  variant="standard"
                  id="productNameRef"
                  label="Product Name"
                  type="text"
                  fullWidth
                  inputRef={productNameRef}
                  inputProps={{ minLength: 2 }}
                  required
                />
                <TextField
                  margin="normal"
                  variant="standard"
                  id="customerNameRef"
                  label="Customer Name"
                  type="text"
                  fullWidth
                  inputRef={customerNameRef}
                  inputProps={{ minLength: 2 }}
                  required
                />
                <TextField
                  margin="normal"
                  variant="standard"
                  id="amountRef"
                  label="Amount"
                  type="number"
                  fullWidth
                  inputRef={amountRef}
                  inputProps={{ minLength: 2 }}
                  required
                />
                <TextField
                  margin="normal"
                  variant="standard"
                  id="transactionTypeRef"
                  label="Transaction Type"
                  type="text"
                  fullWidth
                  inputRef={transactionTypeRef}
                  inputProps={{ minLength: 2 }}
                  required
                />
                <TextField
                  margin="normal"
                  variant="standard"
                  id="transactionDescriptionRef"
                  label="Transaction Description"
                  type="text"
                  fullWidth
                  inputRef={transactionDescriptionRef}
                  inputProps={{ minLength: 2 }}
                  required
                />
                <TextField
                  margin="normal"
                  variant="standard"
                  id="transactionDateRef"
                  label="Transaction Date"
                  type="date"
                  fullWidth
                  inputRef={transactionDateRef}
                  inputProps={{ minLength: 2 }}
                  required
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
    </Box>
  );
};

export default Transactions;
