import { Close, Delete, Edit } from "@mui/icons-material";
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
import { useEffect, useState } from "react";
import DataGridComponent from "../../../components/dataGrid/DataGridComponent";
import { useValue } from "../../../context/ContextProvider";
import { salesData } from "../../../data";
import { fDate, fDateTime, fDateTimeSuffix } from "../../../utils/formatTime";
import MaterialReactTable from "material-react-table";

const Sales = ({ setSelectedLink, link }) => {
  const [salesList, setSetSalesList] = useState([{}]);
  const [rowSelection, setRowSelection] = useState({});
  const {
    state: { openLogin, loading },
    dispatch,
  } = useValue();

  const handleClose = () => {
    dispatch({ type: "CLOSE_LOGIN" });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const convertUserId = () => {
    const obj = JSON.stringify(rowSelection);
    const rowUserId = obj.substring(obj.indexOf(`"`) + 1, obj.lastIndexOf(`"`));
    return rowUserId;
  };

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
    },

    {
      accessorKey: "total",
      header: "Total",
    },
    {
      accessorKey: "paid",
      header: "Paid",
    },
    {
      accessorKey: "tax",
      header: "Tax",
    },
  ];

  useEffect(() => {
    setSelectedLink(link);
  }, []);
  return (
    <Box display="flex" flexDirection="column">
      <Paper elevation={3}>
        <Stack direction="row" spacing={2} m={3} justifyContent="space-between">
          <Typography variant="h5">Sales</Typography>
        </Stack>
        <Dialog open={openLogin} onClose={handleClose}>
          <DialogTitle>
            Sales Information
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
        </Dialog>
        <Box m={2}>
          {loading ? (
            <CircularProgress color="secondary" />
          ) : (
            <>
              <MaterialReactTable
                columns={columns}
                data={salesList}
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
      </Paper>
    </Box>
  );
};

export default Sales;
