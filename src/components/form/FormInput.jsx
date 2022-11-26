import { Grid, TextField } from "@mui/material";
import React, { useState } from "react";

const FormInput = (props) => {
  return (
    <Grid item xs={12} sm={12} p={1}>
      <TextField
        id={props.id}
        label={props.label}
        name={props.name}
        // value={props.value}
        // inputRef={props.inputRef}
        fullWidth
        disabled={props.disabled}
        onChange={props.onChange}
        {...props}
      />
    </Grid>
  );
};

export default FormInput;
