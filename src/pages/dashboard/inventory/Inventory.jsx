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
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import SpeedialComponent from "../../../components/SpeedialComponent";
import { useValue } from "../../../context/ContextProvider";
import MaterialReactTable from "material-react-table";
import { db_firestore } from "../../../api/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { Close, FileDownload, SaveOutlined } from "@mui/icons-material";
import FormInput from "../../../components/form/FormInput";
import { LoadingButton } from "@mui/lab";
import DialogComponent from "../../../components/form/DialogComponent";
import { ExportToCsv } from "export-to-csv";

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

          inventoryIn: doc.data().inventoryIn,
          inventoryOut: doc.data().inventoryOut,
          stock: doc.data().inventoryIn - doc.data().inventoryOut,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("submit");
    try {
      const rowUserId = convertUserId();
      const washingtonRef = doc(db_firestore, "products", rowUserId);
      console.log(inventory.inventoryQuantity);
      await updateDoc(washingtonRef, {
        inventoryIn: parseInt(inventory.inventoryIn),
        inventoryOut: parseInt(inventory.inventoryOut),
        stock:
          parseInt(inventory.inventoryIn) - parseInt(inventory.inventoryOut),
      })
        .then((result) => {
          Swal.fire({
            text: "Successfully Save",
            icon: "success",
            confirmButtonText: "OK",
          });
          fetchStockList();
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

    let docSnap;
    if (e === "edit") {
      const rowUserId = convertUserId();
      const docRef = doc(db_firestore, "products", rowUserId);
      docSnap = await getDoc(docRef);

      if (docSnap && docSnap.exists()) {
        inventory.id = docSnap.data().id;

        inventory.inventoryProductName = docSnap.data().productName;

        inventory.inventoryQuantity = docSnap.data().stock;
        inventory.inventoryIn = docSnap.data().inventoryIn;
        inventory.inventoryOut = docSnap.data().inventoryOut;
        // product.lowStockLevel = docSnap.data().lowStockLevel;

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
          const rowUserId = convertUserId();
          try {
            deleteDoc(doc(db_firestore, "products", rowUserId));
            fetchStockList();
          } catch (error) {
            console.log(error);
          }
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
      header: "Item",
    },
    {
      accessorKey: "inventoryIn",
      header: "In",
    },
    {
      accessorKey: "inventoryOut",
      header: "Out",
    },

    { accessorKey: "stock", header: "Onhand" },
  ]);

  const convertUserId = () => {
    const obj = JSON.stringify(rowSelection);
    const rowUserId = obj.substring(obj.indexOf(`"`) + 1, obj.lastIndexOf(`"`));
    return rowUserId;
  };

  const handleExportData = () => {
    const filteredStockList = stockList.map((item) => {
      return {
        id: item.id,
        productName: item.productName,
        inventoryIn: item.inventoryIn,
        inventoryOut: item.inventoryOut,
        stock: item.stock,
      };
    });

    csvExporter.generateCsv(filteredStockList);
  };

  const csvOptions = {
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalSeparator: ".",
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: columns.map((c) => c.header),
  };

  const csvExporter = new ExportToCsv(csvOptions);

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
                    renderTopToolbarCustomActions={({ table }) => (
                      <Box
                        sx={{
                          display: "flex",
                          gap: "1rem",
                          p: "0.5rem",
                          flexWrap: "wrap",
                        }}
                      >
                        <Button
                          color="primary"
                          //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                          onClick={handleExportData}
                          startIcon={<FileDownload />}
                          variant="contained"
                        >
                          Export Inventory
                        </Button>
                      </Box>
                    )}
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
                  type="number"
                  id="inventoryQuantity"
                  label="Onhand"
                  name="inventoryQuantity"
                  onChange={handleChange}
                  value={inventory.inventoryQuantity}
                  xs={6}
                  sm={6}
                  // inputRef={nameRef}
                />
                <FormInput
                  fullWidth
                  required
                  type="number"
                  id="inventoryIn"
                  label="In"
                  name="inventoryIn"
                  onChange={handleChange}
                  value={inventory.inventoryIn}
                  xs={6}
                  sm={6}
                  // inputRef={nameRef}
                />
                <FormInput
                  fullWidth
                  required
                  type="number"
                  id="inventoryOut"
                  label="Out"
                  name="inventoryOut"
                  onChange={handleChange}
                  value={inventory.inventoryOut}
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

        <SpeedialComponent handleAction={handleAction} noAdd={true} />
      </Box>
    </>
  );
};

export default Inventory;
