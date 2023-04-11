import {
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import SpeedialComponent from "../../../components/SpeedialComponent";
import { useValue } from "../../../context/ContextProvider";
import MaterialReactTable from "material-react-table";
import { db_firestore } from "../../../api/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { Close, SaveOutlined } from "@mui/icons-material";
import FormInput from "../../../components/form/FormInput";
import { LoadingButton } from "@mui/lab";
import DialogComponent from "../../../components/form/DialogComponent";

const Inventory = ({ setSelectedLink, link }) => {
  const [stockList, setStockList] = useState([{}]);
  const [rowSelection, setRowSelection] = useState({});
  const [currentStockValue, setCurrentStockValue] = useState("");
  const [currentStock, setCurrentStock] = useState();
  const {
    state: { openLogin, loading, inventory, product },
    dispatch,
  } = useValue();

  useEffect(() => {
    setSelectedLink(link);
    fetchStockList();
  }, []);

  const fetchStockList = async () => {
    try {
      dispatch({ type: "START_LOADING" });
      const list = [];
      const querySnapshot = await getDocs(collection(db_firestore, "products"));

      querySnapshot.forEach((doc) => {
        list.push({
          id: doc.data().id,
          photoUrl: doc.data().photoUrl,
          productName: doc.data().productName,
          productDescription: doc.data().productDescription,
          price: doc.data().price,
          cost: doc.data().cost,
          stock: doc.data().stock,
          lowStockLevel: doc.data().lowStockLevel,
        });
      });

      setStockList(list);
      dispatch({ type: "END_LOADING" });
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    dispatch({ type: "CLOSE_LOGIN" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleAction = async (e) => {
    // console.log(e);

    if (e === "add") {
      console.log("add ine sa inventory");
      dispatch({ type: "OPEN_LOGIN" });
    }
    let docSnap;
    if (e === "edit") {
      const rowUserId = convertUserId();
      const docRef = doc(db_firestore, "products", rowUserId);
      docSnap = await getDoc(docRef);

      setCurrentStockValue(docSnap.data().stock);

      if (docSnap && docSnap.exists()) {
        inventory.id = docSnap.data().id;

        inventory.inventoryProductName = docSnap.data().productName;
        inventory.inventoryProductDescription =
          docSnap.data().productDescription;
        inventory.inventoryPrice = docSnap.data().price;

        // product.stock = docSnap.data().stock;
        // product.lowStockLevel = docSnap.data().lowStockLevel;

        setCurrentStock(docSnap.data().stock);
        dispatch({ type: "OPEN_LOGIN" });
      } else if (e === "edit") {
        console.log("No such document!");
      }
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
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });
    }
  };

  const handleChange = (e) => {
    dispatch({
      type: "UPDATE_INVENTORY",
      payload: { [e.target.id]: e.target.value },
    });
  };

  const columns = useMemo(() => [
    {
      accessorKey: "id",
      header: "ID",
    },

    {
      accessorKey: "productName",
      header: "Product",
    },
    { accessorKey: "productDescription", header: "Description" },

    {
      accessorKey: "price",
      header: "Price",
      Cell: ({ cell, row }) => (
        <>
          <Typography>₱ {row.original.price}</Typography>
        </>
      ),
    },
    { accessorKey: "quantity", header: "Quantity" },
  ]);

  const convertUserId = () => {
    const obj = JSON.stringify(rowSelection);
    const rowUserId = obj.substring(obj.indexOf(`"`) + 1, obj.lastIndexOf(`"`));
    return rowUserId;
  };

  return (
    <>
      <Box display="flex" flexDirection="column">
        <Paper elevation={3}>
          <Stack
            direction="row"
            spacing={2}
            m={3}
            justifyContent="space-between"
          >
            <Typography variant="h5">Inventory</Typography>
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
              </>
            )}
          </Box>
        </Paper>

        <Dialog onClose={handleClose} open={openLogin} fullWidth maxWidth="lg">
          <DialogTitle>
            Edit Inventory
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
          </DialogTitle>

          <form onSubmit={handleSubmit}>
            <DialogContent dividers={true}>
              <DialogContentText>Product Information :</DialogContentText>
              <Grid container>
                <FormInput
                  fullWidth
                  required
                  type="text"
                  id="inventoryProductName"
                  label="Product Name"
                  name="inventoryProductName"
                  onChange={handleChange}
                  value={inventory.inventoryProductName}
                  xs={6}
                  sm={6}
                />
                <FormInput
                  fullWidth
                  required
                  type="text"
                  id="inventoryProductDescription"
                  label="Product Description"
                  name="inventoryProductDescription"
                  onChange={handleChange}
                  value={inventory.inventoryProductDescription}
                  xs={6}
                  sm={6}
                  // inputRef={nameRef}
                />
                <FormInput
                  fullWidth
                  required
                  type="number"
                  id="inventoryPrice"
                  label="Price"
                  name="inventoryPrice"
                  onChange={handleChange}
                  value={inventory.inventoryPrice}
                  xs={6}
                  sm={6}
                  // inputRef={nameRef}
                />
                <FormInput
                  fullWidth
                  required
                  type="number"
                  id="inventoryQuantity"
                  label="Quantity"
                  name="inventoryQuantity"
                  onChange={handleChange}
                  value={inventory.inventoryQuantitu}
                  xs={6}
                  sm={6}
                  // inputRef={nameRef}
                />
              </Grid>
            </DialogContent>
            <DialogActions sx={{ px: "19px" }}>
              <LoadingButton
                type="submit"
                variant="contained"
                color="success"
                endIcon={<SaveOutlined />}
                loading={loading}
                loadingPosition="end"
              >
                Save
              </LoadingButton>
            </DialogActions>
          </form>
        </Dialog>

        <SpeedialComponent handleAction={handleAction} />
      </Box>
    </>
  );
};

export default Inventory;
