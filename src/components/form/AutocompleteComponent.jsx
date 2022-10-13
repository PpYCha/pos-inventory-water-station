import { Autocomplete, Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useValue } from "../../context/ContextProvider";

const AutocompleteComponent = ({
  options,
  label,
  id,
  size,
  inputRef,
  value1,
}) => {
  const { dispatch } = useValue();
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState("");

  // console.log(value);

  const handleChange = (e, newValue) => {
    setValue(newValue.label);
    const str = e.target.id;

    const newStr = str.split("-")[0];
    console.log(newValue);
    // dispatch({
    //   type: "UPDATE_USER_PROFILE",
    //   payload: { [newStr]: newValue.label },
    // });
  };

  const handleInputChange = (e, newValue) => {
    setValue(newValue.label);
    const str = e.target.id;

    const newStr = str.split("-")[0];
    console.log(newValue.label);
    dispatch({
      type: "UPDATE_USER_PROFILE",
      payload: { [newStr]: newValue.label },
    });
  };

  return (
    <>
      <Grid item xs={6} sm={6} p={1}>
        <Autocomplete
          options={options}
          renderInput={(params) => <TextField {...params} label={label} />}
          value={value1 ? value1 : value}
          onChange={(e, newValue) => handleChange(e, newValue)}
          // inputValue={inputValue}
          // onInputChange={(event, newInputValue) => {
          //   setInputValue(newInputValue);
          // }}
          disablePortal
          id={id}
        />
      </Grid>
    </>
  );
};

export default AutocompleteComponent;
