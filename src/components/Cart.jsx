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
import noProductImage from "../assets/no-image.png";
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
import InvoiceComponent from "./InvoiceComponent";
import InvoiceDialogComponent from "./InvoiceDialogComponent";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Cart({ handleClickOpen, openCart, handleClickClose }) {
  const {
    state: { cart, loading, products, customerInvoice, openLogin },
    dispatch,
  } = useValue();
  const [total, setTotal] = useState();
  const [cash, setCash] = useState(0);
  const [change, setChange] = useState(0);
  const [tax, setTax] = useState(0);

  React.useEffect(() => {
    setTotal(
      cart.reduce((acc, curr) => acc + Number(curr.price) * curr.qty, 0)
    );
  }, [cart]);

  const findProduct = (id) => {
    const productFind = products.find((obj) => obj.id === id);

    return productFind;
    // return products;
  };

  const handleChange = (e) => {
    dispatch({
      type: "UPDATE_CUSTOMERINVOICE",
      payload: { [e.target.id]: e.target.value },
    });
  };

  const handleSubmit = (e) => {
    dispatch({ type: "START_LOADING" });
    cart.map((item) => {
      let id = item.id;
      let qty = item.qty;
      const object = findProduct(id);
      let newStock = object.stock - qty;
      handleUpdate(id, newStock);
    });
    handleTransaction();
    dispatch({ type: "END_LOADING" });
  };

  const handleClose = () => {
    setCash(0);
    setChange(0);
    dispatch({ type: "RESET_CART" });
    dispatch({ type: "CLOSE_LOGIN" });
    dispatch({ type: "CLOSE_CART" });
  };

  const handleTransaction = async () => {
    try {
      let tax = total * 0.12;
      const date = new Date();
      const isoString = date.toISOString();
      const result = await addDoc(collection(db_firestore, "transactions"), {
        subTotal: total,
        taxRate: 12,
        tax: tax,
        total: tax + total,
        date: isoString.substring(0, 10),
        time: isoString.substring(11, 19),
        cart: cart,

        name: customerInvoice.name,
        address: customerInvoice.address,
        phone: customerInvoice.phone,
        email: customerInvoice.email,
      });

      handleClose();

      const res = await fetchSpecificTransaction(result.id);

      // Swal.fire({
      //   text: "Successfully Checkout",
      //   icon: "success",
      //   confirmButtonText: "OK",
      // });
    } catch (error) {
      const textMessage = error.code;
      console.log(textMessage);
      console.log(error);
      // Swal.fire({
      //   text: textMessage.split("/").pop(),
      //   icon: "error",
      //   confirmButtonText: "OK",
      // });
    }
  };

  const handleUpdate = async (id, newStock) => {
    try {
      const washingtonRef = doc(db_firestore, "products", id);
      const result = await updateDoc(washingtonRef, {
        stock: newStock,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSpecificTransaction = async (id) => {
    let docSnap;

    const docRef = doc(db_firestore, "transactions", id);
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

  const handleCash = (e) => {
    setCash(e.target.value);
    setTax(total * 0.12);
    // setTotal(total + tax);
    setChange(e.target.value - (total + total * 0.12));
  };

  return (
    <div>
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
            md={7}
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
                        src={prod.photoUrl || noProductImage}
                        alt={prod.productName}
                        style={{ width: "70%", height: 160 }}
                      />
                    </Grid>
                    <Grid item md={5}>
                      <Typography variant="h6">{prod.productName}</Typography>
                      <Typography variant="subtitle1">
                        {prod.productDescription}
                      </Typography>
                    </Grid>
                    <Grid item md={2}>
                      <Typography variant="h6">Price: ₱{prod.price}</Typography>
                      <Typography variant="h6">Stock: {prod.stock}</Typography>
                    </Grid>
                    <Grid item md={2}>
                      <Stack direction="row" alignItems="center">
                        {/* <IconButton aria-label="increment">
                          <ArrowCircleLeftOutlined />
                        </IconButton> */}
                        <TextField
                          id="stock_input"
                          variant="outlined"
                          size="small"
                          type="number"
                          label="Qty"
                          sx={{
                            width: 100,
                            textAlign: "center",
                          }}
                          align="center"
                          onChange={(e) => {
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
                          label="Remove"
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
          {cart ? (
            <Grid item md={5}>
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
                      <InvoiceComponent
                        cart={cart}
                        amountDue={total}
                        onChange={handleChange}
                      />

                      <Stack direction="column" spacing={0.5} marginTop={5}>
                        <TextField
                          required
                          id="name"
                          name="name"
                          label="Customer Name"
                          type="text"
                          onChange={handleChange}
                        />
                        <TextField
                          required
                          id="address"
                          name="address"
                          label="Address"
                          type="text"
                          onChange={handleChange}
                        />
                        <TextField
                          required
                          id="phone"
                          name="phone"
                          label="Phone"
                          type="number"
                          onChange={handleChange}
                        />
                        <TextField
                          required
                          id="email"
                          name="email"
                          label="Email"
                          type="email"
                          onChange={handleChange}
                        />
                      </Stack>
                    </Box>
                    <Box>
                      <TextField
                        required
                        id="outlined-required"
                        label="Cash Payment"
                        type="number"
                        onChange={handleCash}
                      />
                    </Box>
                    <Box>
                      <TextField
                        id="outlined-required"
                        label="Cash Change"
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
                        disabled={cash < total + tax}
                      >
                        Proceed To Checkout
                      </Button>
                    </Box>
                  </Stack>
                </Grid>
              </Paper>
            </Grid>
          ) : null}
          {/* End Subtotal Cart */}
        </Grid>
      </Dialog>

      <InvoiceDialogComponent openLogin={openLogin} handleClose={handleClose} />
    </div>
  );
}
