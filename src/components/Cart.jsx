import * as React from "react";
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
} from "@mui/material";
import { Box } from "@mui/system";
import ProductImage from "../assets/contemplative-reptile.jpg";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Cart({ handleClickOpen, openCart, handleClickClose }) {
  const {
    state: { cart, loading },
    dispatch,
  } = useValue();
  const [total, setTotal] = React.useState();

  React.useEffect(() => {
    setTotal(
      cart.reduce((acc, curr) => acc + Number(curr.price) * curr.qty, 0)
    );
  }, [cart]);

  const handleChange = () => {};

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
                        src={ProductImage}
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
                          onChange={(e) =>
                            dispatch({
                              type: "CHANGE_CART_QTY",
                              payload: {
                                id: prod.id,
                                qty: e.target.value,
                              },
                            })
                          }
                        ></TextField>
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
                <Typography variant="h4">
                  Subtotal {cart.length} items
                </Typography>
                <Typography variant="h6">Total:₱ {total} </Typography>
              </Grid>
              <Grid justifyContent="flex-end" alignItems="flex-end">
                <Button type="submit" variant="contained" color="success">
                  Proceed To Checkout
                </Button>
              </Grid>
            </Paper>
          </Grid>
          {/* End Subtotal Cart */}
        </Grid>
      </Dialog>
    </div>
  );
}
