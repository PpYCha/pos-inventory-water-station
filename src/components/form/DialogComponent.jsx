import { Close, Send } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
} from "@mui/material";
import React, { useState } from "react";
import { useValue } from "../../context/ContextProvider";
import FormInput from "./FormInput";

const DialogComponent = ({ open, title, inputs }) => {
  const [value, setValue] = useState();

  const { dispatch } = useValue();

  const handleClose = () => {
    dispatch({ type: "CLOSE_LOGIN" });
  };

  return (
    <Dialog onClose={handleClose} open={open} fullWidth maxWidth="lg">
      <DialogTitle>
        {title}
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
      <DialogContent dividers>
        <DialogContentText>
          Please fill product information in the fields :
        </DialogContentText>
        <Grid>
          <form>
            {inputs.map((input) => (
              <FormInput key={input.id} {...input} />
            ))}
          </form>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: "19px" }}>
        <Button
          type="submit"
          variant="contained"
          color="success"
          endIcon={<Send />}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogComponent;
