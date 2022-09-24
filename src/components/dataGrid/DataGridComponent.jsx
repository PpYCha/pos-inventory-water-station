import React, { useState } from "react";
import { DataGrid, GridToolbar, gridClasses } from "@mui/x-data-grid";
import LinearProgress from "@mui/material/LinearProgress";

import {
  Button,
  ButtonBase,
  CircularProgress,
  Paper,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import { grey } from "@mui/material/colors";

const StyledToolbar = styled(DataGrid)({
  height: 52,
});

const DataGridComponent = ({ rows, columns, loading }) => {
  const [pageSize, setPageSize] = useState(10);

  return (
    <DataGrid
      loading={loading}
      rows={rows}
      columns={columns}
      sx={{
        "&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell": {
          py: "8px",
        },
        "&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell": {
          py: "15px",
        },
        "&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell": {
          py: "22px",
        },
        height: "500px",
        // width: "500px",
        [`& .${gridClasses.row}`]: {
          bgcolor: (theme) =>
            theme.palette.mode === "light" ? grey[200] : grey[900],
        },
      }}
      components={{ Toolbar: GridToolbar, LoadingOverlay: LinearProgress }}
      // disableSelectionOnClick
      pageSize={pageSize}
      onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
      rowsPerPageOptions={[5, 10, 20]}
      pagination
      getRowSpacing={(params) => ({
        top: params.isFirstVisible ? 0 : 5,
        bottom: params.isLastVisible ? 0 : 5,
      })}
    />
  );
};

export default DataGridComponent;
