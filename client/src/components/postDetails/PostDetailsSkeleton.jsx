import React from 'react'
import Skeleton from '@material-ui/lab/Skeleton'
import { Typography, Divider, Paper } from '@material-ui/core';
import CommentSectionSkeleton from './CommentSectionSkeleton';
import useStyles from './styles';

export default function PostDetailsSkeleton() {
  const classes = useStyles();

  return (
    <Paper style={{ padding: '20px', borderRadius: '15px' }} elevation={6}>
      <div className={classes.card}>
        <div className={classes.section}>
          <Typography variant='h3' component='h2'>
            <Skeleton variant='text' animation='wave' width={150} />
          </Typography>
          <Typography
            gutterBottom
            variant='h6'
            color='textSecondary'
            component='h2'
          >
            <Skeleton variant='text' animation='wave' width={80} />
          </Typography>
          <Typography gutterBottom variant='body1' component='p'>
            <Skeleton variant='text' animation='wave' width={180} height={70} />
          </Typography>
          <Typography
            style={{ fontWeight: 550, display: 'inline' }}
            variant='h6'
            color='textPrimary'
          >
            <Skeleton variant='text' animation='wave' width={60} />
          </Typography>
          <Typography
            style={{ textAlign: 'right', display: 'inline', float: 'right' }}
            variant='body1'
            color='textSecondary'
          >
            <Skeleton variant='text' animation='wave' width={40} />
          </Typography>

          <Divider style={{ margin: '20px 0' }} />
          <CommentSectionSkeleton />
        </div>

        <div className={classes.imageSection}>
          <img className={classes.media} src={''} alt='' />
        </div>
      </div>

      <div className={classes.section}>
        <Typography gutterBottom variant='h5'>
          <Skeleton variant='text' animation='wave' width={50} />
        </Typography>
        <Divider />
        <div className={classes.recommendedPosts}>
          <div className={{ margin: '20px' }}>
            <Typography gutterBottom variant='h6'>
              <Skeleton variant='text' animation='wave' width={40} />
            </Typography>
            <Typography gutterBottom variant='subtitle2'>
              <Skeleton variant='text' animation='wave' width={30} />
            </Typography>
            <Typography gutterBottom variant='subtitle2'>
              <Skeleton variant='text' animation='wave' />
            </Typography>
            <Typography gutterBottom variant='subtitle1'>
              <Skeleton variant='text' animation='wave' />
            </Typography>
            <Skeleton>
              <img
                src={'selectedFile || placeholder'}
                width='180px'
                height='180px'
                alt=''
              />
            </Skeleton>
          </div>
        </div>
      </div>
    </Paper>
  );
};
