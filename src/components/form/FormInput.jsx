import { Grid, TextField } from "@mui/material";
import React, { useState } from "react";

const FormInput = (props) => {
  return (
    <Grid item xs={props.xs} sm={props.sm} p={1}>
      <TextField
        id={props.id}
        label={props.label}
        name={props.name}
        // value={props.value}
        inputRef={props.inputRef || undefined}
        required
        fullWidth
        inputProps={{ minLength: 4 }}
        disabled={props.disabled}
        onChange={props.onChange}
        {...props}
      />
    </Grid>
  );
};

export default FormInput;
