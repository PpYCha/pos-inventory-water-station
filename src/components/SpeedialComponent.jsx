import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import React from "react";

const SpeedialComponent = ({
  props,
  handleCloseSpeedial,
  handleOpenSpeedial,
  handleAction,
  actions,
  open,
}) => {
  return (
    <SpeedDial
      ariaLabel="SpeedDial controlled open example"
      sx={{ position: "fixed", bottom: 16, right: 16 }}
      icon={<SpeedDialIcon />}
      onClose={handleCloseSpeedial}
      onOpen={handleOpenSpeedial}
      open={open}
    >
      {actions.map((action) => (
        <SpeedDialAction
          id={action.name}
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          onClick={handleAction}
        />
      ))}
    </SpeedDial>
  );
};

export default SpeedialComponent;