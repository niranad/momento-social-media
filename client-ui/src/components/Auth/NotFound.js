import React from 'react';
import { Typography } from '@material-ui/core';

export default function NotFound() {
  return (
    <Typography
      style={{ marginTop: 20 }}
      variant='h4'
      color='secondary'
      component='p'
    >
      Page Not Found
    </Typography>
  );
}
