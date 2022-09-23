import React from 'react';
import Post from './Post/Post';
import { Grid, Typography, Paper } from '@material-ui/core';
import { useSelector } from 'react-redux';
import useStyles from './styles';
import PostSkeleton from './Post/PostSkeleton';

export default function Posts({ setCurrentId }) {
  const classes = useStyles();
  const { postsData, isLoading, requestFailed } = useSelector(
    ({ posts }) => posts,
  );

  if (!isLoading && !postsData.length)
    return (
      <Typography
        style={{ textAlign: 'center' }}
        gutterBottom
        color='textSecondary'
        variant='h4'
        component='p'
      >
        No posts to display.
      </Typography>
    );

  const previewArr = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <Grid
      container
      alignItems='stretch'
      spacing={3}
    >
      {isLoading ? (
        previewArr.map((n, i) => <PostSkeleton key={i} />)
      ) : requestFailed ? (
        <Paper className={classes.paper} xs={12} sm={12} md={12}>
          <Typography>
            Unable to load posts. Please ensure you have a stable internet
            connection and try again.
          </Typography>
        </Paper>
      ) : !postsData.length ? (
        <Paper className={classes.paper} xs={12} sm={12} md={12}>
          <Typography
            style={{ fontFamily: 'Roboto', textAlign: 'center' }}
            variant='body1'
            component='p'
          >
            No Posts to display at the moment. When you or other people create a
            post it will appear here.
          </Typography>
        </Paper>
      ) : (
        postsData.map((post) => (
          <Grid key={post._id} item xs={12} sm={12} md={6} lg={6} xl={3}>
            <Post key={post._id} post={post} setCurrentId={setCurrentId} />
          </Grid>
        ))
      )}
    </Grid>
  );
};
