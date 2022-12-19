import React, { useRef, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { useValue } from "../context/ContextProvider";
import {
  AccountCircle,
  ArrowCircleLeftOutlined,
  ArrowCircleRightOutlined,
  DeleteOutline,
  TextFieldsOutlined,
} from "@mui/icons-material";
import {
  Card,
  CardContent,
  CardHeader,
  Paper,
  Grid,
  Stack,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Box } from "@mui/system";
import ProductImage from "../assets/contemplative-reptile.jpg";
import Swal from "sweetalert2";
import { db_firestore } from "../api/firebase";

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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Cart({ handleClickOpen, openCart, handleClickClose }) {
  const {
    state: { cart, loading, products },
    dispatch,
  } = useValue();
  const [total, setTotal] = useState();
  const [cash, setCash] = useState(0);
  const [change, setChange] = useState(0);

  React.useEffect(() => {
    setTotal(
      cart.reduce((acc, curr) => acc + Number(curr.price) * curr.qty, 0)
    );
  }, [cart]);

  const findProduct = (id) => {
    return products.find((obj) => obj.id === id);
    // return products;
  };

  const handleSubmit = (e) => {
    cart.map((item) => {
      let id = item.id;
      let qty = item.qty;
      const object = findProduct(id);
      let newStock = object.stock - qty;
      handleUpdate(id, newStock);
      console.log(object.stock, " - ", qty, " = ", newStock);
    });
    handleTransaction();
  };

  const handleClose = () => {
    setCash(0);
    setChange(0);
    dispatch({ type: "RESET_CART" });
    dispatch({ type: "CLOSE_LOGIN" });
  };

  const handleTransaction = async () => {
    try {
      await addDoc(collection(db_firestore, "transactions"), {
        cash: total,
        cart: cart,
      })
        .finally((result) => {
          Swal.fire({
            text: "Successfully Save",
            icon: "success",
            confirmButtonText: "OK",
          });
          handleClose();
        })
        .catch((e) => {
          const textMessage = e.code;
          Swal.fire({
            text: textMessage.split("/").pop(),
            icon: "error",
            confirmButtonText: "OK",
          });
        });
    } catch (error) {}
  };

  const handleUpdate = async (id, newStock) => {
    try {
      const washingtonRef = doc(db_firestore, "products", id);
      const result = await updateDoc(washingtonRef, {
        stock: newStock,
      });
      Swal.fire({
        text: "Successfully Save",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        text: error.code.split("/").pop(),
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleCash = (e) => {
    setCash(e.target.value);
    setChange(e.target.value - total);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open full-screen dialog
      </Button>
      <Dialog
        fullScreen
        open={openCart}
        onClose={handleClickClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClickClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Cart
            </Typography>
          </Toolbar>
        </AppBar>

        <Grid
          container
          direction="row"
          justifyContent="space-evenly"
          alignItems="stretch"
          p={2}
        >
          {/* //Start cart items */}

          <Grid
            item
            md={8}
            justifyContent="space-evenly"
            alignItems="center"
            p={1}
          >
            {cart.map((prod, index) => {
              return (
                <Paper
                  key={index}
                  elevation={2}
                  sx={{
                    padding: 2,
                    margin: 0.5,
                    width: "100%",
                  }}
                >
                  <Grid container>
                    <Grid item md={3}>
                      <img
                        src={prod.photoUrl}
                        alt={prod.productName}
                        style={{ width: "90%", height: 200 }}
                      />
                    </Grid>
                    <Grid item md={3}>
                      <Typography variant="h5">{prod.productName}</Typography>
                      <Typography variant="subtitle1">
                        {prod.productDescription}
                      </Typography>
                    </Grid>
                    <Grid item md={3}>
                      <Typography variant="h5">₱ {prod.price}</Typography>
                    </Grid>
                    <Grid item md={3}>
                      <Stack direction="row" alignItems="center">
                        {/* <IconButton aria-label="increment">
                          <ArrowCircleLeftOutlined />
                        </IconButton> */}
                        <TextField
                          id="stock_input"
                          variant="outlined"
                          size="small"
                          type="number"
                          sx={{
                            width: 100,
                            textAlign: "center",
                          }}
                          align="center"
                          onChange={(e) => {
                            console.log(e.target.value);

                            return {
                              result:
                                e.target.value === ""
                                  ? (e.target.value = "0")
                                  : dispatch({
                                      type: "CHANGE_CART_QTY",
                                      payload: {
                                        id: prod.id,
                                        qty: e.target.value,
                                      },
                                    }),
                            };
                          }}
                        />
                        {/* <IconButton aria-label="decrement">
                          <ArrowCircleRightOutlined />
                        </IconButton> */}
                        <IconButton
                          color="error"
                          aria-label="decrement"
                          size="large"
                          onClick={() =>
                            dispatch({
                              type: "REMOVE_FROM_CART",
                              payload: prod,
                            })
                          }
                        >
                          <DeleteOutline fontSize="inherit" />
                        </IconButton>
                      </Stack>
                    </Grid>
                  </Grid>
                </Paper>
              );
            })}
          </Grid>

          {/* //End Cart items  */}
          {/* //Start Subtotal cart */}
          <Grid item md={4}>
            <Paper
              sx={{
                paddingLeft: 1,
                paddingTop: 1,
                paddingBottom: 1,
                height: "100%",
              }}
            >
              <Grid>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="h4">
                      Subtotal {cart.length} items
                    </Typography>
                    <Typography variant="h6">Total:₱ {total} </Typography>
                  </Box>
                  <Box>
                    <TextField
                      required
                      id="outlined-required"
                      label="Payment"
                      type="number"
                      onChange={handleCash}
                    />
                  </Box>
                  <Box>
                    <TextField
                      id="outlined-required"
                      label="Change"
                      type="number"
                      value={change}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Box>

                  <Box>
                    <Button
                      type="submit"
                      variant="contained"
                      color="success"
                      onClick={handleSubmit}
                      disabled={cash < total}
                    >
                      Proceed To Checkout
                    </Button>
                  </Box>
                </Stack>
              </Grid>
            </Paper>
          </Grid>
          {/* End Subtotal Cart */}
        </Grid>
      </Dialog>
    </div>
  );
}
