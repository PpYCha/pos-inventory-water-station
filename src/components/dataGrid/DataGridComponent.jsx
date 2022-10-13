import React, { useState } from "react";
import {
  DataGrid,
  GridToolbar,
  gridClasses,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import LinearProgress from "@mui/material/LinearProgress";

import {
  Button,
  ButtonBase,
  CircularProgress,
  Paper,
  Stack,
  Typography,
  styled,
  Toolbar,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { Delete, Edit, RemoveRedEyeRounded } from "@mui/icons-material";

const StyledToolbar = styled(DataGrid)({
  height: 52,
});
const NewToolbar = () => {
  return (
    <GridToolbarContainer>
      <Button startIcon={<RemoveRedEyeRounded />} color="info">
        View
      </Button>
      <Button startIcon={<Edit />}>Edit</Button>
      <Button startIcon={<Delete />} color="warning">
        Delete
      </Button>
    </GridToolbarContainer>
  );
};

const DataGridComponent = ({ rows, columns, loading }) => {
  const [pageSize, setPageSize] = useState(10);

  return (
    <DataGrid
      loading={loading}
      rows={rows}
      columns={columns}
      sx={{
        "& .MuiDataGrid-row": {
          maxHeight: "none !important",
        },
        "& .MuiDataGrid-renderingZone": {
          maxHeight: "none !important",
        },
        "& .MuiDataGrid-cell": {
          lineHeight: "unset !important",
          maxHeight: "none !important",
          whiteSpace: "normal",
        },
        "&  .MuiDataGrid-cell:focus-within": {
          outline: "none !important",
        },
        // width: "500px",
      }}
      // Toolbar: NewToolbar,
      components={{ LoadingOverlay: LinearProgress }}
      // disableSelectionOnClick
      pageSize={pageSize}
      onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
      rowsPerPageOptions={[10, 50, 100]}
      pagination
      autoHeight
      getRowSpacing={(params) => ({
        top: params.isFirstVisible ? 0 : 5,
        bottom: params.isLastVisible ? 0 : 5,
      })}
    />
  );
};

export default DataGridComponent;
