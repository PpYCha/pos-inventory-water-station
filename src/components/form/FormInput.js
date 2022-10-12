import { Grid, TextField } from "@mui/material";
import React, { useState } from "react";

const FormInput = (props) => {
  const [focused, setFocused] = useState(false);
  const [isFormInvalid, setIsFormInvalid] = useState(false);

  const handleFocus = (e) => {
    setFocused(true);
  };
  return (
    <Grid item xs={props.xs} sm={props.sm}>
      <TextField
        id={props.id}
        label={props.label}
        name={props.name}
        type={props.type}
        margin="normal"
        value={props.value}
        fullWidth
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
