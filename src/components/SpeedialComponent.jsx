import { Add, Delete, Edit } from "@mui/icons-material";
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import React from "react";

const SpeedialComponent = ({ handleAction, noAdd }) => {
  const actions = [
    {
      icon: <Add />,
      name: "Add",
      operation: "add",
    },

    { icon: <Edit />, name: "Edit", operation: "edit" },
    { icon: <Delete />, name: "Delete", operation: "delete" },
  ];

  if (noAdd) {
    const addActionIndex = actions.findIndex(
      (item) => item.operation === "add"
    );
    actions.splice(addActionIndex, 1);
  }

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
