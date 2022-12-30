import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ProductImage from "../assets/contemplative-reptile.jpg";
import { useValue } from "../context/ContextProvider";
import { Box, Divider, Grid, IconButton, Paper } from "@mui/material";
import {
  AddShoppingCartOutlined,
  RemoveShoppingCartOutlined,
} from "@mui/icons-material";
import noProductImage from "../assets/no-image.png";

const SingleProduct = ({ prod }) => {
  const {
    state: { openLogin, cart, loading },
    dispatch,
  } = useValue();

  return (
    <Grid item xs={6} md={4} lg={2}>
      <Paper elevation={10}>
        <Card>
          <CardMedia
            component="img"
            src={prod.photoUrl || noProductImage}
            alt={prod.productName}
          />
          <Divider />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {prod.productName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {prod.productDescription}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ₱{prod.price}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Stock:{prod.stock}
            </Typography>
          </CardContent>
          <CardActions>
            {cart.some((p) => p.id === prod.id) ? (
              <Box sx={{ display: "flex" }} key={prod.id}>
                <Button
                  color="error"
                  startIcon={<RemoveShoppingCartOutlined />}
                  onClick={() =>
                    dispatch({
                      type: "REMOVE_FROM_CART",
                      payload: prod,
                    })
                  }
                >
                  Remove from Cart
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: "flex" }}>
                <Button
                  color="success"
                  startIcon={<AddShoppingCartOutlined />}
                  onClick={() =>
                    dispatch({
                      type: "ADD_TO_CART",
                      payload: prod,
                    })
                  }
                  disabled={prod.stock <= "0"}
                >
                  {prod.stock <= "0" ? "Out of Stock" : "Add to Cart"}
                </Button>
              </Box>
            )}
          </CardActions>
        </Card>
      </Paper>
    </Grid>
  );
};

export default SingleProduct;
