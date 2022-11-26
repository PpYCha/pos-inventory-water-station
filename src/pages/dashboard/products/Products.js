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
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import DataGridComponent from "../../../components/dataGrid/DataGridComponent";
import DialogComponent from "../../../components/form/DialogComponent";
import SpeedialComponent from "../../../components/SpeedialComponent";
import { useValue } from "../../../context/ContextProvider";
import MaterialReactTable from "material-react-table";
import { db_firestore } from "../../../api/firebase";

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
import Swal from "sweetalert2";
import { async } from "@firebase/util";

const Products = ({ setSelectedLink, link }) => {
  const [productsData, setProductsData] = useState([{}]);
  const [rowSelection, setRowSelection] = useState({});

  const {
    state: { openLogin, product, loading },
    dispatch,
  } = useValue();

  const handleClose = () => {
    dispatch({ type: "CLOSE_LOGIN" });
    dispatch({ type: "RESET_PRODUCT" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(product);

    if (product.id) {
      handleUpdate();
    } else {
      handleSave();
    }
  };

  const handleSave = async () => {
    await addDoc(collection(db_firestore, "products"), {
      productPicture: product.productPicture,
      productName: product.productName,
      productDescription: product.productDescription,
      price: product.price,
      cost: product.cost,
      stock: product.stock,
      lowStockLevel: product.lowStockLevel,
    })
      .then((data) => {
        const docRef = doc(db_firestore, "products", data.id);
        updateDoc(docRef, {
          id: data.id,
        });
      })
      .then((result) => {
        Swal.fire({
          text: "Successfully Save",
          icon: "success",
          confirmButtonText: "OK",
        });
        fetchProductsList();
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
  };

  const handleUpdate = async () => {
    try {
      const rowUserId = convertUserId();
      const washingtonRef = doc(db_firestore, "products", rowUserId);

      await updateDoc(washingtonRef, {
        productPicture: product.productPicture,
        productName: product.productName,
        productDescription: product.productDescription,
        price: product.price,
        cost: product.cost,
        stock: product.stock,
        lowStockLevel: product.lowStockLevel,
      })
        .then((result) => {
          Swal.fire({
            text: "Successfully Save",
            icon: "success",
            confirmButtonText: "OK",
          });
          fetchProductsList();
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
    } catch (error) {
      console.log(error);
    }
  };

  const handleAction = async (e) => {
    if (e === "add") {
      dispatch({ type: "OPEN_LOGIN" });
    }
    if (e === "edit") {
      const rowUserId = convertUserId();
      const docRef = doc(db_firestore, "products", rowUserId);
      const docSnap = await getDoc(docRef);
      console.log(docSnap);
      if (docSnap.exists()) {
        product.id = docSnap.data().id;
        product.productPicture = docSnap.data().productPicture;
        product.productName = docSnap.data().productName;
        product.productDescription = docSnap.data().productDescription;
        product.price = docSnap.data().price;
        product.cost = docSnap.data().cost;
        product.stock = docSnap.data().stock;
        product.lowStockLevel = docSnap.data().lowStockLevel;
        dispatch({ type: "OPEN_LOGIN" });
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }

    if (e === "delete") {
      const rowUserId = convertUserId();

      try {
        deleteDoc(doc(db_firestore, "products", rowUserId));
        fetchProductsList();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const convertUserId = () => {
    const obj = JSON.stringify(rowSelection);
    const rowUserId = obj.substring(obj.indexOf(`"`) + 1, obj.lastIndexOf(`"`));
    return rowUserId;
  };

  useEffect(() => {
    setSelectedLink(link);
    fetchProductsList();
  }, []);

  const handleChange = (e) => {
    console.log(e.target.id);
    dispatch({
      type: "UPDATE_PRODUCT",
      payload: { [e.target.id]: e.target.value },
    });
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

      setProductsData(list);
      dispatch({ type: "END_LOADING" });
    } catch (error) {
      console.log(error);
    }
  };

  const columns = useMemo(() => [
    {
      accessorKey: "id",
      header: "ID",
    },

    {
      accessorKey: "productName",
      header: "Name",
      Cell: ({ cell, row }) => (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <Typography>{cell.getValue()}</Typography>
          </Box>
        </>
      ),
    },
    { accessorKey: "productDescription", header: "Description" },
    // { accessorKey: "username", header: "Password" },
    { accessorKey: "price", header: "Price" },
    { accessorKey: "cost", header: "Cost" },
    { accessorKey: "stock", header: "Stock" },
    { accessorKey: "lowStockLevel", header: "Low Stock Level" },
  ]);

  const inputs = [
    {
      id: "productName",
      name: "productName",
      label: "Product Name",
      type: "text",
      required: true,

      value: product.productName,
      xs: 12,
      sm: 12,
    },
    {
      id: "productDescription",
      name: "productDescription",
      label: "Product Description",
      value: product.productDescription,
      type: "text",
      required: true,

      xs: 12,
      sm: 12,
    },
    {
      id: "price",
      name: "price",
      label: "Price",
      value: product.price,
      type: "number",
      required: true,
      xs: 6,
      sm: 6,
    },
    {
      id: "stock",
      name: "stock",
      label: "Stock",
      type: "number",
      value: product.stock,
      required: true,
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
          handleSubmit={handleSubmit}
          handleChange={handleChange}
        />

        <Box m={2}>
          {loading ? (
            <CircularProgress color="secondary" />
          ) : (
            <>
              <MaterialReactTable
                columns={columns}
                data={productsData}
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
          )}
        </Box>
        <SpeedialComponent handleAction={handleAction} />
      </Paper>
    </Box>
  );
};

export default Products;
