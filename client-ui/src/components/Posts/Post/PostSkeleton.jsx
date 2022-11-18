import React from 'react';
import {
  Card,
  Typography,
  Button,
  CardMedia,
  CardActions,
  CardContent,
  Grid,
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import useStyles from './styles';

const PostSkeleton = ({ key }) => {
  const classes = useStyles();

  return (
    <Grid key={key} item xs={12} sm={12} md={6} lg={6} xl={3}>
      <Card raised elevation={6}>
        <Skeleton
          variant='rectangular'
          width='100%'
          height='50%'
          animation='wave'
        >
          <CardMedia className={classes.media} image='' />
        </Skeleton>
        <div className={classes.details}>
          <Typography variant='body2' color='textSecondary'>
            <Skeleton variant='text' animation='wave' width={80} />
          </Typography>
        </div>

        <Typography className={classes.title} variant='h6' gutterBottom>
          <Skeleton variant='text' animation='wave' width={150} />
        </Typography>
        <CardContent>
          <Typography variant='body1' component='p'>
            <Skeleton variant='text' animation='wave' height={50} />
          </Typography>
        </CardContent>

        <CardActions className={classes.cardActions}>
          <Button className={classes.cardActionsButton} size='small'>
            <Skeleton variant='text' animation='wave' width={25} />
          </Button>
          <Button className={classes.cardActionsButton} size='small'>
            <Skeleton variant='text' animation='wave' width={25} />
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default PostSkeleton;
