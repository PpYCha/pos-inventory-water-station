import {
  Add,
  ClassSharp,
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
  Grid,
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
import noProductImage from "../../../assets/no-image.png";

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
import { getImageUrl, uploadImage } from "../../../utils/uploadImage";
import FormInput from "../../../components/form/FormInput";

import RemoveStockDialog from "./RemoveStockDialog";

const Products = ({ setSelectedLink, link }) => {
  const [productsData, setProductsData] = useState([{}]);
  const [rowSelection, setRowSelection] = useState({});
  const [currentStockValue, setCurrentStockValue] = useState("");
  const [openStock, setOpenStock] = useState(false);
  const [openRemoveStock, setOpenRemoveStock] = useState(false);
  const [currentStock, setCurrentStock] = useState();

  const addStockRef = useRef("");
  const removeStockRef = useRef("");
  const remarksRef = useRef("");

  const {
    state: { openLogin, product, loading },
    dispatch,
  } = useValue();

  const handleClose = () => {
    console.log("close");
    dispatch({ type: "RESET_PRODUCT" });
    dispatch({ type: "CLOSE_LOGIN" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(currentStock);
    console.log(product.stock);
    if (product.id) {
      handleUpdate();
    } else {
      handleSave();
    }
  };

  const handleSave = async () => {
    try {
      let url;
      if (product.file) {
        const imageRef = await uploadImage("images/product", product.file);
        url = await getImageUrl(imageRef);
      }

      await addDoc(collection(db_firestore, "products"), {
        photoUrl: url || null,
        productName: product.productName,
        productDescription: product.productDescription,
        price: product.price,
        cost: product.cost,
        // stock: product.stock,
        // lowStockLevel: product.lowStockLevel,
      })
        .then((data) => {
          const docRef = doc(db_firestore, "products", data.id);
          updateDoc(docRef, {
            id: data.id,
          });
        })
        .finally((result) => {
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

  const handleUpdate = async () => {
    try {
      const rowUserId = convertUserId();
      const washingtonRef = doc(db_firestore, "products", rowUserId);

      let url;
      if (product.file) {
        const imageRef = await uploadImage("images/product", product.file);
        url = await getImageUrl(imageRef);
      }

      if (currentStockValue > product.stock) {
        //remove stock
      } else {
        //add stock
      }

      console.log("inputed:", product.stock);
      console.log("current stock:", currentStockValue);

      await updateDoc(washingtonRef, {
        photoUrl: url || product.photoUrl,
        productName: product.productName,
        productDescription: product.productDescription,
        price: product.price,
        cost: product.cost,
        // stock: product.stock,
        // lowStockLevel: product.lowStockLevel,
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
    // console.log(e);

    if (e === "add") {
      dispatch({ type: "OPEN_LOGIN" });
      return;
    }

    let docSnap;
    if (e === "edit") {
      const rowUserId = convertUserId();
      const docRef = doc(db_firestore, "products", rowUserId);
      docSnap = await getDoc(docRef);

      setCurrentStockValue(docSnap.data().stock);

      if (docSnap && docSnap.exists()) {
        product.id = docSnap.data().id;
        product.photoUrl = docSnap.data().photoUrl;
        product.productName = docSnap.data().productName;
        product.productDescription = docSnap.data().productDescription;
        product.price = docSnap.data().price;
        product.cost = docSnap.data().cost;
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

          const rowUserId = convertUserId();
          try {
            deleteDoc(doc(db_firestore, "products", rowUserId));
            fetchProductsList();
          } catch (error) {
            console.log(error);
          }
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });
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
          photoUrl: doc.data().photoUrl,
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

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const photoUrl = URL.createObjectURL(file);
      console.log(photoUrl);
      dispatch({
        type: "UPDATE_PRODUCT",
        payload: { ...product, file, photoUrl },
      });
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
            <Box
              component="img"
              src={row.original.photoUrl || noProductImage}
              sx={{
                maxWidth: "50%",
                maxHeight: "50%",
                cursor: "pointer",
              }}
            />
            <Typography>{cell.getValue()}</Typography>
          </Box>
        </>
      ),
    },
    { accessorKey: "productDescription", header: "Description" },
    // { accessorKey: "username", header: "Password" },
    {
      accessorKey: "price",
      header: "Price",
      Cell: ({ cell, row }) => (
        <>
          <Typography>₱ {row.original.price}</Typography>
        </>
      ),
    },
    { accessorKey: "cost", header: "Cost" },
    // { accessorKey: "stock", header: "Total Stock" },
    // { accessorKey: "lowStockLevel", header: "Low Stock Level" },
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
      id: "cost",
      name: "cost",
      label: "Cost",
      value: product.cost,
      type: "number",
      required: true,
      xs: 6,
      sm: 6,
    },
  ];

  const handleShowAddStock = () => {
    console.log("add stock show");
    setOpenStock(true);
  };
  const handleShowRemoveStock = () => {
    console.log("remove stock show");
    setOpenRemoveStock(true);
  };

  const handleAddStock = () => {
    let newStock =
      parseInt(product.stock) + parseInt(addStockRef.current.value);
    product.stock = newStock;
    console.log(newStock);
    setOpenStock(false);
  };

  const handleCloseStock = () => {
    setOpenStock(false);
  };

  const handleRemoveStock = () => {
    let newStock =
      parseInt(product.stock) - parseInt(removeStockRef.current.value);
    product.stock = newStock;
    console.log(newStock);
    setOpenRemoveStock(false);

    console.log(newStock);
  };

  const handleRemoveCloseStock = () => {
    setOpenRemoveStock(false);
  };

  return (
    <Box display="flex" flexDirection="column">
      <Paper elevation={3}>
        <Stack direction="row" spacing={2} m={3} justifyContent="space-between">
          <Typography variant="h5">Product List</Typography>
        </Stack>
        <DialogComponent
          open={openLogin}
          handleClose={handleClose}
          title="Product Information"
          inputs={inputs}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          handleChangeImage={handleChangeImage}
          imgSrc={product.photoUrl || noProductImage}
          handleShowAddStock={handleShowAddStock}
          handleShowRemoveStock={handleShowRemoveStock}
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

      <Dialog
        open={openStock}
        onClose={handleCloseStock}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Adding Stock"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Enter quantity of stock to be added and it's remark
          </DialogContentText>
          <Grid>
            <FormInput
              id="stockQuantity"
              label="Quantity"
              name="stockQuantity"
              required={true}
              inputRef={addStockRef}
            />
            <FormInput
              id="remarks"
              label="Remark"
              name="remarks"
              required={true}
              inputRef={remarksRef}
            />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddStock}>Add</Button>
          <Button onClick={handleCloseStock}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <RemoveStockDialog
        openRemoveStock={openRemoveStock}
        handleRemoveCloseStock={handleRemoveCloseStock}
        handleRemoveStock={handleRemoveStock}
        removeStockRef={removeStockRef}
        remarks={remarksRef}
      />
    </Box>
  );
};

export default Products;
