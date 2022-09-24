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
        error={
          typeof props.helperText === "undefined" || props.helperText === false
            ? false
            : true
        }
        helperText={props.helperText}
        type={props.type}
        required={props.required}
        fullWidth
        id={props.id}
        label={props.label}
        name={props.name}
        autoComplete={props.autoComplete}
        onChange={props.onChange}

        // onBlur={handleFocus}
        // focused={focused}
        // inputProps={{ pattern: props.pattern }}
      />
    </Grid>
  );
};

export default FormInput;
