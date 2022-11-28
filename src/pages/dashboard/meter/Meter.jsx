import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
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

const Meter = ({ setSelectedLink, link }) => {
  const [metersData, setMetersData] = useState([{}]);
  const [rowSelection, setRowSelection] = useState({});

  const {
    state: { openLogin, loading, meter },
    dispatch,
  } = useValue();

  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleClose = () => {
    dispatch({ type: "RESET_METER" });
    dispatch({ type: "CLOSE_LOGIN" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(meter);

    if (meter.id) {
      handleUpdate();
    } else {
      handleSave();
    }
  };

  const handleSave = async () => {
    try {
      await addDoc(collection(db_firestore, "meters"), {
        id: meter.id,
        dateAM: meter.dateAM,
        meterAM: meter.meterAM,
        imageUrlAM: meter.imageUrlAM,
        datePM: meter.datePM,
        meterPM: meter.meterPM,
        imageUrlPM: meter.imageUrlPM,
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
      const rowUserId = convertUserId();

      try {
        deleteDoc(doc(db_firestore, "meters", rowUserId));
        fetchMeterList();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleChange = (e) => {
    dispatch({
      type: "UPDATE_METER",
      payload: { [e.target.id]: e.target.value },
    });
  };

  const inputs = [
    {
      autoFocus: true,

      id: "dateAM",
      name: "dateAM",
      label: "Date AM",
      value: meter.dateAM,
      type: "date",
      InputLabelProps: { shrink: true },
      xs: 12,
      sm: 6,
    },
    {
      id: "meterAM",
      name: "meterAM",
      label: "Meter AM",
      value: meter.meterAM,
      type: "number",
      xs: 12,
      sm: 6,
    },

    {
      id: "datePM",
      name: "datePM",
      label: "Date PM",
      value: meter.datePM,
      type: "date",
      InputLabelProps: { shrink: true },
      xs: 12,
      sm: 6,
    },
    {
      id: "meterPM",
      name: "meterPM",
      label: "Meter PM",
      value: meter.meterPM,
      type: "number",
      xs: 12,
      sm: 6,
    },
  ];

  const columns = useMemo(() => [
    {
      accessorKey: "id",
      header: "ID",
    },

    { accessorKey: "dateAM", header: "Date AM" },

    { accessorKey: "meterAM", header: "Meter AM" },
    { accessorKey: "datePM", header: "Date PM" },
    { accessorKey: "meterPM", header: "Meter PM" },
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

            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <Button variant="outlined">
                  Drag 'n' drop some files here, or click to select files
                </Button>
              )}
            </div>
          </Stack>

          <DialogComponent
            open={openLogin}
            handleClose={handleClose}
            title="Meter Information"
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
