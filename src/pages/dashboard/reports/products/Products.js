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
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import DataGridComponent from "../../../components/dataGrid/DataGridComponent";
import DialogComponent from "../../../components/form/DialogComponent";
import { useValue } from "../../../context/ContextProvider";

import { productData } from "../../../data";

const Products = ({ setSelectedLink, link }) => {
  const [productList, setProductList] = useState([{}]);

  const {
    state: { openLogin },
    dispatch,
  } = useValue();
  const productNameRef = useRef();
  const productDescriptionRef = useRef();
  const priceRef = useRef();
  const stockRef = useRef();

  const handleClose = () => {
    dispatch({ type: "CLOSE_LOGIN" });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    setSelectedLink(link);
    fetchAPI();
  }, []);

  const [loading, setLoading] = useState(true);

  const fetchAPI = async () => {
    setLoading(true);
    setProductList(productData);
    setLoading(false);
  };

  const columns = [
    { field: "id", headerName: "ID", hide: true },

    { field: "productName", headerName: "Product Name", minWidth: 250 },
    {
      field: "productDescription",
      headerName: "Product Description",
      minWidth: 350,
    },
    { field: "price", headerName: "Price", minWidth: 200 },
    { field: "stock", headerName: "Stock", minWidth: 200 },
    {
      field: "action",
      headerName: "Action",
      minWidth: 150,
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

  return (
    <Box display="flex" flexDirection="column">
      <Paper elevation={3}>
        <Stack direction="row" spacing={2} m={3} justifyContent="space-between">
          <Typography variant="h5">Product List</Typography>

          <Button
            variant="contained"
            onClick={() => dispatch({ type: "OPEN_LOGIN" })}
          >
            Add New Product
          </Button>
        </Stack>
        <Dialog open={openLogin} onClose={handleClose}>
          <DialogTitle>
            Product Information
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
                  id="productDescriptionRef"
                  label="Product Discription"
                  type="text"
                  fullWidth
                  inputRef={productDescriptionRef}
                  inputProps={{ minLength: 2 }}
                  required
                />
                <TextField
                  margin="normal"
                  variant="standard"
                  id="priceRef"
                  label="Price"
                  type="number"
                  fullWidth
                  inputRef={priceRef}
                  inputProps={{ minLength: 2 }}
                  required
                />
                <TextField
                  margin="normal"
                  variant="standard"
                  id="stockRef"
                  label="Stock"
                  type="number"
                  fullWidth
                  inputRef={stockRef}
                  inputProps={{ minLength: 2 }}
                  required
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
              <DataGridComponent rows={productList} columns={columns} />
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Products;
