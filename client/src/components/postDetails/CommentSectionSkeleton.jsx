import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import { Typography, Button, TextField } from '@material-ui/core';
import useStyles from './styles';

const CommentSectionSkeleton = () => {
  const user = JSON.parse(localStorage.getItem('profile'));
  const classes = useStyles();

  return (
    <div>
      <div>
        <div className={classes.commentsOuterContainer}>
          <div className={classes.commentsInnerContainer}>
            <Typography variant='h6'>
              <Skeleton variant='text' animation='wave' width={50} />
            </Typography>
            <Skeleton
              variant='rectangular'
              animation='wave'
              width={120}
              height={80}
            />
          </div>
          {user?.result?.name && (
            <div style={{ minWidth: '60%', marginTop: '10px' }}>
              <Typography variant='h6'>
                <Skeleton variant='text' animation='wave' width={60} />
              </Typography>
              <Skeleton variant='rectangular' animation='wave'>
                <TextField fullWidth rows={4} variant='outlined' multiline />
              </Skeleton>
              <Skeleton variant='rectangular' animation='wave'>
                <Button
                  styles={{ marginTop: '10px' }}
                  fullWidth
                  variant='contained'
                />
              </Skeleton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentSectionSkeleton;
