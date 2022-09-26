import { Close } from "@mui/icons-material";
import { Dialog, DialogTitle, IconButton } from "@mui/material";
import React from "react";

const DialogComponent = ({ open, title }) => {
  //   const [open, setOpen] = useState(false);
  const handleClose = () => {
    open(false);
  };
  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>
        {title}
        <IconButton
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: (theme) => theme.palette.grey[500],
          }}
          s
          onClick={handleClose}
        >
          <Close />
        </IconButton>
      </DialogTitle>
    </Dialog>
  );
};

export default DialogComponent;
