import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ProductImage from "../assets/contemplative-reptile.jpg";
import { useValue } from "../context/ContextProvider";
import { Box, IconButton } from "@mui/material";
import {
  AddShoppingCartOutlined,
  RemoveShoppingCartOutlined,
} from "@mui/icons-material";

const SingleProduct = ({ prod }) => {
  const {
    state: { openLogin, cart, loading },
    dispatch,
  } = useValue();

  return (
    <Box
      sx={{
        width: "30%",
        margin: "10px",
      }}
    >
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia
          component="img"
          height="200"
          width="200"
          image={ProductImage}
          alt={prod.productName}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {prod.productName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {prod.productDescription}
          </Typography>
        </CardContent>
        <CardActions>
          {cart.some((p) => p.id === prod.id) ? (
            <Box sx={{ display: "flex", gap: "1rem" }} key={prod.id}>
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
            <Box sx={{ display: "flex", gap: "1rem" }}>
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
    </Box>
  );
};

export default SingleProduct;
