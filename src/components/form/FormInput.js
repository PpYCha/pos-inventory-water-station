import { Grid, TextField } from "@mui/material";
import React, { useState } from "react";

const FormInput = (props) => {
  const [focused, setFocused] = useState(false);
  const [isFormInvalid, setIsFormInvalid] = useState(false);

  const handleFocus = (e) => {
    setFocused(true);
  };
  return (
    <Grid item xs={props.xs} sm={props.sm} p={1}>
      <TextField
        id={props.id}
        label={props.label}
        name={props.name}
        value={props.value}
        fullWidth
        disabled={props.disabled}
        {...props}
        // InputLabelProps={
        //   typeof props.value === "undefined"
        //     ? { shrink: false }
        //     : { shrink: true }
        // }
      />
    </Grid>
  );
};

export default FormInput;
