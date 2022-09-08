import React, { useState, useEffect } from 'react';
import { Container, Grow, Grid, Typography, AppBar } from '@material-ui/core';
import memories from './images/memories.png';
import { getPosts } from './actions/posts';
import { useDispatch } from 'react-redux';
import Posts from './components/Posts/Posts';
import Form from './components/Form/Form';
import useStyles from './styles';

function App() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    dispatch(getPosts());
  }, [currentId, dispatch]);

  return (
    <Container maxwidth='lg'>
      <AppBar className={classes.appBar} position='static' color='inherit'>
        <Typography className={classes.heading} variant='h2' align='center'>
          Memories&nbsp;
        </Typography>
        <img src={memories} alt='memories' height='60' />
      </AppBar>
      <Grow in>
        <Container>
          <Grid
            className={classes.mainContainer}
            container
            justifyContent='space-between'
            alignItems='stretch'
            spacing={3}
          >
            <Grid item xs={12} sm={7}>
              <Posts setCurrentId={setCurrentId} />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Form currentId={currentId} setCurrentId={setCurrentId} />
            </Grid>
          </Grid>
        </Container>
      </Grow>
    </Container>
  );
}

export default App;

