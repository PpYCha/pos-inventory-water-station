import {
  Box,
  IconButton,
  Paper,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Button,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import MaterialReactTable from "material-react-table";
import {
  Add,
  AddCircle,
  AddShoppingCart,
  AddShoppingCartOutlined,
  Close,
  Delete,
  Edit,
  RemoveCircle,
  RemoveShoppingCart,
  RemoveShoppingCartOutlined,
  SaveOutlined,
} from "@mui/icons-material";
import { useValue } from "../../../context/ContextProvider";
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
import FormInput from "../../../components/form/FormInput";
import { LoadingButton } from "@mui/lab";

const Pos = ({ setSelectedLink, link }) => {
  const [productList, setProductList] = useState([{}]);

  const {
    state: { openLogin, cart, loading },
    dispatch,
  } = useValue();

  const handleSubmit = (e) => {
    e.preventDefault();

    // dispatch({
    //   type: "CURRENT_CART",
    //   payload: {
    //     cartItems: {
    //       id: row.original.id,
    //       price: row.original.price,
    //       productName: row.original.productName,
    //       productPicture: row.original.productPicture,
    //     },
    //   },
    // });
  };

  const handleClose = () => {
    dispatch({ type: "CLOSE_LOGIN" });
    dispatch({ type: "START_LOADING" });
    dispatch({ type: "END_LOADING" });
  };

  const handleChange = (e) => {
    dispatch({
      type: "UPDATE_METER",
      payload: { [e.target.id]: e.target.value },
    });
  };

  const handleAddCart = (row) => {
    console.log(row);
    // cartItems.id = row.id;
    // cartItems.productName = row.productName;
    // cartItems.productPicture = row.productPicture;
    // cartItems.price = row.price;
    // cartItems.stock = row.stock;
    // cartItems.quantity = row.quantity;
    // console.log(cartItems.length);
    // dispatch({ type: "OPEN_LOGIN" });
  };

  const fetchProductsList = async () => {
    try {
      dispatch({ type: "START_LOADING" });
      const list = [];
      const querySnapshot = await getDocs(collection(db_firestore, "products"));

      querySnapshot.forEach((doc) => {
        list.push({
          id: doc.data().id,
          productPicture: doc.data().productPicture,
          productName: doc.data().productName,
          productDescription: doc.data().productDescription,
          price: doc.data().price,
          cost: doc.data().cost,
          stock: doc.data().stock,
          lowStockLevel: doc.data().lowStockLevel,
        });
      });

      setProductList(list);
      dispatch({ type: "END_LOADING" });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setSelectedLink(link);
    fetchProductsList();
  }, []);

  const columns = useMemo(() => [
    {
      accessorKey: "id",
      header: "ID",
    },

    { accessorKey: "productName", header: "Product Name" },
    { accessorKey: "stock", header: "Stock" },
    { accessorKey: "price", header: "Price" },

    // { accessorKey: "meterPM", header: "Meter PM" },
  ]);
  return (
    <Box display="flex" flexDirection="column">
      <Paper elevation={3}>
        <MaterialReactTable
          state={{ isLoading: loading }}
          columns={columns}
          data={productList}
          initialState={{ columnVisibility: { id: false } }}
          enableEditing
          renderRowActions={({ row, table }) => (
            <>
              {cart.some((p) => p.id === row.original.id) ? (
                <Box sx={{ display: "flex", gap: "1rem" }}>
                  <IconButton
                    color="error"
                    onClick={() => {
                      dispatch({
                        type: "REMOVE_FROM_CART",
                        payload: row.original,
                      });
                    }}
                  >
                    <RemoveShoppingCartOutlined />
                  </IconButton>
                </Box>
              ) : (
                <Box sx={{ display: "flex", gap: "1rem" }}>
                  <IconButton
                    color="success"
                    onClick={() => {
                      dispatch({
                        type: "ADD_TO_CART",
                        payload: row.original,
                      });
                    }}
                    disabled={row.original.stock === "0"}
                  >
                    {row.original.stock === "0" ? (
                      "Out of Stock"
                    ) : (
                      <AddShoppingCartOutlined />
                    )}
                  </IconButton>
                </Box>
              )}
            </>
          )}
        />
      </Paper>

      <Dialog onClose={handleClose} open={openLogin} fullWidth maxWidth="lg">
        <DialogTitle>
          Meter Information
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
            <DialogContentText>
              Please fill meter information in the fields :
            </DialogContentText>
            <Grid container>
              <FormInput
                fullWidth
                required
                type="number"
                id="meterPM"
                label="productName"
                name="meterPM"
                onChange={handleChange}
                // value={cartItems.productName}
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
    </Box>
  );
};

export default Pos;
