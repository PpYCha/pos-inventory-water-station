import {
  Close,
  SaveAltOutlined,
  SaveOutlined,
  Send,
} from "@mui/icons-material";
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
import AutocompleteComponent from "./AutocompleteComponent";
import FormInput from "./FormInput";

const DialogComponent = ({
  open,
  title,
  inputs,
  autoCompleteInputs,
  handleSubmit,
  handleChange,
  handleClose,
}) => {
  const [value, setValue] = useState();

  const { dispatch } = useValue();

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
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <DialogContentText>
            Please fill product information in the fields :
          </DialogContentText>
          <Grid container>
            {inputs.map((input) => (
              <FormInput key={input.id} {...input} onChange={handleChange} />
            ))}

            {autoCompleteInputs?.map((autoCompleteInput, index) => {
              return (
                <AutocompleteComponent
                  key={index}
                  options={autoCompleteInput.label}
                  label={autoCompleteInput.name}
                  id={autoCompleteInput.name}
                />
              );
            })}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: "19px" }}>
          <Button
            type="submit"
            variant="contained"
            color="success"
            endIcon={<SaveOutlined />}
          >
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DialogComponent;
