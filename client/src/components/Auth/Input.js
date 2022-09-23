import React from 'react';
import { TextField, Grid, InputAdornment, IconButton } from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';


export default function Input({ id,
  label,
  name,
  handleChange,
  type,
  autoFocus,
  handleShowPassword,
  half,
}) {

  return (
    <Grid item xs={12} sm={half ? 6 : 12}>
      <TextField
        id={id}
        name={name}
        label={label}
        autoFocus={autoFocus}
        onChange={handleChange}
        variant='outlined'
        required
        fullWidth
        type={type}
        InputProps={
          name === 'password' ? {
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton onClick={handleShowPassword}>
                  {type === 'password' ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          } : null
        }
      />
    </Grid>
  );
};
