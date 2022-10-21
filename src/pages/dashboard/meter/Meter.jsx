import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import DataGridComponent from "../../../components/dataGrid/DataGridComponent";
import { useValue } from "../../../context/ContextProvider";
import { meterData } from "../../../data";
import { fDateTime } from "../../../utils/formatTime";

const Meter = ({ setSelectedLink, link }) => {
  const {
    state: { openLogin, loading },
    dispatch,
  } = useValue();

  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const columns = [
    { field: "id", headerName: "ID", flex: 1, hide: true },
    {
      field: "dateAM",
      headerName: "Date AM",
      minWidth: 200,
      renderCell: (params) => {
        return (
          <>
            <Typography>{fDateTime(params.value)}</Typography>
          </>
        );
      },
    },
    { field: "meterAM", headerName: "Meter AM", minWidth: 200 },
    {
      field: "imageUrlAM",
      headerName: "Image AM",
      minWidth: 150,
      renderCell: (params) => {
        console.log(params.value);
        return (
          <>
            <Box
              component="img"
              src={params.value}
              sx={{ width: 100, height: 100 }}
            />
          </>
        );
      },
    },
    {
      field: "datePM",
      headerName: "Date PM",
      minWidth: 200,
      renderCell: (params) => {
        return (
          <>
            <Typography>{fDateTime(params.value)}</Typography>
          </>
        );
      },
    },
    { field: "meterPM", headerName: "Meter PM", minWidth: 200 },
    {
      field: "imageUrlPM",
      headerName: "Image PM",
      minWidth: 150,
      renderCell: (params) => {
        console.log(params.value);
        return (
          <>
            <Box
              component="img"
              src={params.value}
              sx={{ width: 100, height: 100 }}
            />
          </>
        );
      },
    },
  ];

  useEffect(() => {
    setSelectedLink(link);
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

          <Box m={2}>
            {loading ? (
              <CircularProgress color="secondary" />
            ) : (
              <>
                <DataGridComponent rows={meterData} columns={columns} />
              </>
            )}
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default Meter;
