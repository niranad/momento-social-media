import React from 'react';
import Post from './Post/Post';
import { Grid, Typography, Paper } from '@material-ui/core';
import { useSelector } from 'react-redux';
import useStyles from './styles';
import PostSkeleton from './Post/PostSkeleton';

export default function Posts({ setCurrentId }) {
  const classes = useStyles();
  const { postsData, isLoading, isFetchingBySearch, fetchPostsFailed } =
    useSelector(({ posts }) => posts);

  const previewArr = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <Grid container alignItems='stretch' spacing={3}>
      {isLoading || isFetchingBySearch ? (
        previewArr.map((n, i) => <PostSkeleton key={i} />)
      ) : fetchPostsFailed ? (
        <Paper className={classes.paper} xs={12} sm={12} md={12}>
          <Typography variant='h6' style={{ textAlign: 'center', padding: 20 }}>
            Unable to load posts. Please ensure you have a stable internet
            connection and try again.
          </Typography>
        </Paper>
      ) : !postsData.length ? (
        <Typography
          style={{ fontFamily: 'Roboto', padding: 20 }}
          variant='h5'
          component='h5'
        >
          No moments to display
        </Typography>
      ) : (
        postsData.map((post) => (
          <Grid key={post._id} item xs={12} sm={12} md={6} lg={6} xl={3}>
            <Post key={post._id} post={post} setCurrentId={setCurrentId} />
          </Grid>
        ))
      )}
    </Grid>
  );
}
