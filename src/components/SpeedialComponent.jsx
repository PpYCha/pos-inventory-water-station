import { Add, Delete, Edit } from "@mui/icons-material";
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import React from "react";

const actions = [
  {
    icon: <Add />,
    name: "Add",
    operation: "add",
  },
  // { icon: <RemoveRedEye />, name: "View", operation: "view" },
  { icon: <Edit />, name: "Edit", operation: "edit" },
  { icon: <Delete />, name: "Delete", operation: "delete" },
];

const SpeedialComponent = ({ handleAction }) => {
  return (
    <SpeedDial
      ariaLabel="SpeedDial controlled open example"
      sx={{ position: "fixed", bottom: 16, right: 16 }}
      icon={<SpeedDialIcon />}
      // onClose={handleCloseSpeedial}
      // onOpen={handleOpenSpeedial}
      // open={open}
    >
      {actions.map((action) => (
        <SpeedDialAction
          id={action.name}
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          onClick={(e) => {
            handleAction(action.operation);
          }}
        />
      ))}
    </SpeedDial>
  );
};

export default SpeedialComponent;
