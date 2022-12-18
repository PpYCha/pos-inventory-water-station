import { Backdrop, Button, CircularProgress } from "@mui/material";
import React from "react";

const BackdropComponent = ({ open }) => {
  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default BackdropComponent;
