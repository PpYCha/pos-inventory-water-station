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
import LoadingButton from "@mui/lab/LoadingButton";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import DataGridComponent from "../../../components/dataGrid/DataGridComponent";
import { useValue } from "../../../context/ContextProvider";
import { meterData } from "../../../data";
import { fDateTime } from "../../../utils/formatTime";

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
import DialogComponent from "../../../components/form/DialogComponent";
import MaterialReactTable from "material-react-table";
import SpeedialComponent from "../../../components/SpeedialComponent";
import Swal from "sweetalert2";
import { Close, SaveOutlined } from "@mui/icons-material";
import FormInput from "../../../components/form/FormInput";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";
import { storage } from "../../../api/firebase";
import { v4 } from "uuid";
import { async } from "@firebase/util";
import { upload } from "@testing-library/user-event/dist/upload";
import { result } from "lodash";

const Meter = ({ setSelectedLink, link }) => {
  const [metersData, setMetersData] = useState([{}]);
  const [rowSelection, setRowSelection] = useState({});
  const [imageUpload1, setImageUpload1] = useState(null);
  const [imageUpload2, setImageUpload2] = useState(null);

  const {
    state: { openLogin, loading, meter },
    dispatch,
  } = useValue();

  const imagesListRef = ref(storage, "images/");

  const uploadFile = async () => {
    const imageRef = ref(storage, `images/meterAM/${imageUpload1.name + v4()}`);
    const waitimage1 = await uploadBytes(imageRef, imageUpload1).then(
      (snapshot) => {
        return getDownloadURL(snapshot.ref).then((url) => {
          // dispatch({
          //   type: "UPDATE_METER",
          //   payload: { imageUrlAM: url },
          // });

          console.log("image1:", url);
          return url;
        });
      }
    );

    const imageRef1 = ref(
      storage,
      `images/meterPM/${imageUpload2.name + v4()}`
    );
    const waitimage2 = await uploadBytes(imageRef1, imageUpload2).then(
      (snapshot) => {
        return getDownloadURL(snapshot.ref).then((url) => {
          // dispatch({
          //   type: "UPDATE_METER",
          //   payload: { imageUrlPM: url },
          // });
          console.log("image2:", url);
          return url;
        });
      }
    );

    return [waitimage1, waitimage2];
  };

  const handleClose = () => {
    dispatch({ type: "RESET_METER" });
    dispatch({ type: "CLOSE_LOGIN" });
    dispatch({ type: "START_LOADING" });
    dispatch({ type: "END_LOADING" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (meter.id) {
      handleUpdate();
    } else {
      handleSave();
    }
  };

  const handleSave = async () => {
    try {
      dispatch({ type: "START_LOADING" });
      const [waitimage1, waitimage2] = await uploadFile();

      console.log("wait ine:", waitimage1);
      console.log("wait ine:", waitimage2);

      addDoc(collection(db_firestore, "meters"), {
        id: meter.id,
        dateAM: meter.dateAM,
        meterAM: meter.meterAM,
        imageUrlAM: waitimage1,
        datePM: meter.datePM,
        meterPM: meter.meterPM,
        imageUrlPM: waitimage2,
      })
        .then((data) => {
          const docRef = doc(db_firestore, "meters", data.id);
          updateDoc(docRef, {
            id: data.id,
          });
        })
        .finally((result) => {
          Swal.fire({
            text: "Successfully Save",
            icon: "success",
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              fetchMeterList();
              handleClose();
            }
          });
        })
        .catch((e) => {
          const textMessage = e.code;
          Swal.fire({
            text: textMessage.split("/").pop(),
            icon: "error",
            confirmButtonText: "OK",
          });
        });
      dispatch({ type: "END_LOADING" });
    } catch (error) {}
  };

  const handleUpdate = async () => {
    try {
      const rowUserId = convertUserId();
      const washingtonRef = doc(db_firestore, "meters", rowUserId);

      await updateDoc(washingtonRef, {
        id: meter.id,
        dateAM: meter.dateAM,
        meterAM: meter.meterAM,
        imageUrlAM: meter.imageUrlAM,
        datePM: meter.datePM,
        meterPM: meter.meterPM,
        imageUrlPM: meter.imageUrlPM,
      })
        .then((result) => {
          Swal.fire({
            text: "Successfully Save",
            icon: "success",
            confirmButtonText: "OK",
          });
          fetchMeterList();
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

  const convertUserId = () => {
    const obj = JSON.stringify(rowSelection);
    const rowUserId = obj.substring(obj.indexOf(`"`) + 1, obj.lastIndexOf(`"`));
    return rowUserId;
  };

  const handleAction = async (e) => {
    console.log(e);
    if (e === "add") {
      dispatch({ type: "OPEN_LOGIN" });
    }

    if (e === "edit") {
      const rowUserId = convertUserId();
      const docRef = doc(db_firestore, "meters", rowUserId);
      const docSnap = await getDoc(docRef);
      console.log(docSnap);
      if (docSnap.exists()) {
        meter.id = docSnap.data().id;
        meter.dateAM = docSnap.data().dateAM;
        meter.meterAM = docSnap.data().meterAM;
        meter.imageUrlAM = docSnap.data().imageUrlAM;
        meter.datePM = docSnap.data().datePM;
        meter.meterPM = docSnap.data().meterPM;
        meter.imageUrlPM = docSnap.data().imageUrlPM;
        dispatch({ type: "OPEN_LOGIN" });
      } else {
        // doc.data() will be undefined in this case
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
            deleteDoc(doc(db_firestore, "meters", rowUserId));
            fetchMeterList();
          } catch (error) {
            console.log(error);
          }
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });
    }
  };

  const handleChange = (e) => {
    dispatch({
      type: "UPDATE_METER",
      payload: { [e.target.id]: e.target.value },
    });
  };

  const columns = useMemo(() => [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "refillCashMeter",
      header: "Refill Cash Meter",
      Cell: ({ cell, row }) => (
        <Typography>
          {(((row.original.meterPM - row.original.meterAM) * 25) / 5).toFixed(
            2
          )}
        </Typography>
      ),
    },

    { accessorKey: "meterAM", header: "Meter AM" },
    {
      accessorKey: "imageUrlAM",
      header: "Image AM",
      Cell: ({ cell, row }) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <img alt="avatar" height={150} src={cell.getValue()} loading="lazy" />
        </Box>
      ),
    },
    { accessorKey: "meterPM", header: "Meter PM" },
    {
      accessorKey: "imageUrlPM",
      header: "Image PM",
      Cell: ({ cell, row }) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <img alt="avatar" height={150} src={cell.getValue()} loading="lazy" />
        </Box>
      ),
    },
    { accessorKey: "dateAM", header: "Date" },
    // { accessorKey: "meterPM", header: "Meter PM" },
  ]);

  const fetchMeterList = async () => {
    try {
      dispatch({ type: "START_LOADING" });
      const list = [];
      const querySnapshot = await getDocs(collection(db_firestore, "meters"));

      querySnapshot.forEach((doc) => {
        list.push({
          id: doc.data().id,
          dateAM: doc.data().dateAM,
          meterAM: doc.data().meterAM,
          imageUrlAM: doc.data().imageUrlAM,
          datePM: doc.data().datePM,
          meterPM: doc.data().meterPM,
          imageUrlPM: doc.data().imageUrlPM,
        });
      });

      setMetersData(list);
      dispatch({ type: "END_LOADING" });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setSelectedLink(link);
    fetchMeterList();
  }, []);
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
            <Typography variant="h5">Meter List</Typography>
          </Stack>

          <Dialog
            onClose={handleClose}
            open={openLogin}
            fullWidth
            maxWidth="lg"
          >
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
                    required
                    fullWidth
                    type="file"
                    id="imageUrlAM"
                    label="Upload Image"
                    name="imageUrlAM"
                    onChange={(event) => {
                      setImageUpload1(event.target.files[0]);
                    }}
                    InputLabelProps={{ shrink: true }}
                    // value={meter.meterAM}
                    xs={6}
                    sm={6}
                    // inputRef={nameRef}
                  />
                  <FormInput
                    required
                    fullWidth
                    type="number"
                    id="meterAM"
                    label="Meter AM"
                    name="meterAM"
                    onChange={handleChange}
                    value={meter.meterAM}
                    xs={6}
                    sm={6}
                    // inputRef={nameRef}
                  />
                  <Grid item xs={6} sm={6}>
                    <FormInput
                      required
                      fullWidth
                      type="file"
                      id="imageUrlPM"
                      label="Upload Image"
                      name="imageUrlPM"
                      onChange={(event) => {
                        setImageUpload2(event.target.files[0]);
                      }}
                      // value={meter.imageUrlPM}
                      InputLabelProps={{ shrink: true }}
                      xs={12}
                      sm={12}
                      // inputRef={nameRef}
                    />
                  </Grid>
                  <FormInput
                    fullWidth
                    required
                    type="number"
                    id="meterPM"
                    label="Meter PM"
                    name="meterPM"
                    onChange={handleChange}
                    value={meter.meterPM}
                    xs={6}
                    sm={6}
                    // inputRef={nameRef}
                  />
                  <FormInput
                    required
                    fullWidth
                    type="date"
                    id="dateAM"
                    label="Date"
                    name="dateAM"
                    onChange={handleChange}
                    value={meter.dateAM}
                    InputLabelProps={{ shrink: true }}
                    xs={12}
                    sm={12}
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

          <Box m={2}>
            {loading ? (
              <CircularProgress color="secondary" />
            ) : (
              <>
                <MaterialReactTable
                  columns={columns}
                  data={metersData}
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
    </>
  );
};

export default Meter;
