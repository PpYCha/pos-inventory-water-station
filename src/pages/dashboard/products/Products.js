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
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import DataGridComponent from "../../../components/dataGrid/DataGridComponent";
import DialogComponent from "../../../components/form/DialogComponent";
import SpeedialComponent from "../../../components/SpeedialComponent";
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

  const [open, setOpen] = useState(false);
  const handleOpenSpeedial = () => setOpen(true);
  const handleCloseSpeedial = () => {
    setOpen(false);
  };

  const handleAction = (e) => {
    // console.log(e.target.dataset.testid);

    if (e.target.dataset.testid === "AddIcon") {
      dispatch({ type: "OPEN_LOGIN" });
    }
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
    // {
    //   field: "action",
    //   headerName: "Action",
    //   minWidth: 150,
    //   renderCell: (params) => {
    //     return (
    //       <>
    //         <Stack direction="row" spacing={1}>
    //           <IconButton aria-label="edit">
    //             <Edit />
    //           </IconButton>

    //           <IconButton aria-label="delete">
    //             <Delete sx={{ color: "red" }} />
    //           </IconButton>
    //         </Stack>
    //       </>
    //     );
    //   },
    // },
  ];

  const inputs = [
    {
      id: "productNameRef",
      label: "Product Name",
      inputRef: productNameRef,
      type: "text",
      required: true,
      // inputProps: "minLength: 2",
      xs: 12,
      sm: 12,
    },
    {
      id: "productDescriptionRef",
      label: "Product Description",
      inputRef: productDescriptionRef,
      type: "text",
      required: true,
      // inputProps: "minLength: 2",
      xs: 12,
      sm: 12,
    },
    {
      id: "priceRef",
      label: "Price",
      inputRef: { priceRef },
      type: "number",
      required: true,
      // inputProps: "minLength: 2",
      xs: 6,
      sm: 6,
    },
    {
      id: "stockRef",
      label: "Stock",
      type: "number",
      inputRef: { stockRef },
      required: true,
      // inputProps: "minLength: 2",
      xs: 6,
      sm: 6,
    },
  ];

  return (
    <Box display="flex" flexDirection="column">
      <Paper elevation={3}>
        <Stack direction="row" spacing={2} m={3} justifyContent="space-between">
          <Typography variant="h5">Product List</Typography>
        </Stack>
        <DialogComponent
          open={openLogin}
          onClose={handleClose}
          title="Product Information"
          inputs={inputs}
        />

        <Box m={2}>
          {loading ? (
            <CircularProgress color="secondary" />
          ) : (
            <>
              <DataGridComponent rows={productList} columns={columns} />
            </>
          )}
        </Box>
        <SpeedialComponent
          handleCloseSpeedial={handleCloseSpeedial}
          handleOpenSpeedial={handleOpenSpeedial}
          handleAction={handleAction}
          actions={actions}
          open={open}
        />
      </Paper>
    </Box>
  );
};

export default Products;

const actions = [
  { icon: <Add />, name: "Add" },
  { icon: <RemoveRedEye />, name: "View" },
  { icon: <Edit />, name: "Edit" },
  { icon: <Delete />, name: "Delete" },
];
