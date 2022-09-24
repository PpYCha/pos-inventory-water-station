import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataGridComponent from "../../../components/dataGrid/DataGridComponent";

import { productData } from "../../../data";

const Products = ({ setSelectedLink, link }) => {
  const [productList, setProductList] = useState([{}]);

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
    { field: "id", headerName: "ID", flex: 1 },
    { field: "product_name", headerName: "Product Name", flex: 1 },
    { field: "price", headerName: "Price", flex: 1 },
    { field: "stock", headerName: "Stock", flex: 1 },
  ];

  return (
    <Box display="flex" flexDirection="column">
      <Paper elevation={3}>
        <Stack direction="row" spacing={2} m={3} justifyContent="space-between">
          <Typography variant="h5">Product List</Typography>
          <Link to="/add-infrastructure" style={{ textDecoration: "none" }}>
            <Button variant="contained">Add New Product</Button>
          </Link>
        </Stack>
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
