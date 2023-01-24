import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
} from "@mui/material";
import React from "react";
import FormInput from "../../../components/form/FormInput";

const RemoveStockDialog = ({
  openRemoveStock,
  handleRemoveCloseStock,
  handleRemoveStock,
  removeStockRef,
  remarks,
}) => {
  return (
    <Dialog
      open={openRemoveStock}
      onClose={handleRemoveCloseStock}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Removing Stock"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Enter quantity of stock to be remove and it's remark
        </DialogContentText>
        <Grid>
          <FormInput
            id="stockRemoveQuantity"
            label="Quantity"
            name="stockRemoveQuantity"
            required={true}
            inputRef={removeStockRef}
          />
          <FormInput
            id="remarks"
            label="Remark"
            name="remarks"
            required={true}
            inputRef={remarks}
          />
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleRemoveStock}>Remove</Button>
        <Button onClick={handleRemoveCloseStock}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default RemoveStockDialog;
