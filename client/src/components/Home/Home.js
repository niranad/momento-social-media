import React, { useState } from 'react';
import {
  Grow,
  Container,
  Grid,
  Paper,
  AppBar,
  Button,
  TextField,
  Icon
} from '@material-ui/core';
import { getPostsBySearch } from '../../actions/posts';
import { useDispatch } from 'react-redux';
import Posts from '../Posts/Posts';
import { useHistory, useLocation } from 'react-router-dom';
import ChipInput from 'material-ui-chip-input';
import Pagination from '../Pagination';
import Form from '../Form/Form';
import useStyles from './styles';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Home() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [currentId, setCurrentId] = useState(0);
  const query = useQuery();
  const history = useHistory();
  const page = query.get('page') || 1;
  const [searchTitle, setSearchTitle] = useState('');
  const [searchTags, setSearchTags] = useState([]);

  const searchPost = () => {
    if (searchTitle.trim() || searchTags.length > 0) {
      dispatch(
        getPostsBySearch({ title: searchTitle, tags: searchTags.join(',') }),
      );
      history.push(
        `/posts/search?title=${searchTitle || 'none'}&tags=${searchTags.join(
          ',',
        )}`,
      );
    } else {
      history.push('/');
    }
  };

  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      searchPost();
    }
  };

  const handleAdd = (tag) => {
    setSearchTags([...searchTags, tag]);
  };

  const handleDelete = (tagToDelete) => {
    setSearchTags(searchTags.filter((tag) => tag !== tagToDelete));
  };

  return (
    <Grow in>
      <Container maxWidth='xl'>
        <Grid
          className={classes.gridContainer}
          container
          justifyContent='space-between'
          alignItems='stretch'
          spacing={3}
        >
          <Grid item xs={12} sm={6} md={9}>
            <Posts setCurrentId={setCurrentId} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppBar
              className={classes.appBarSearch}
              position='static'
              color='inherit'
            >
              <TextField
                name='search'
                variant='outlined'
                label='Search Title'
                fullWidth
                value={searchTitle}
                onChange={(e) => {
                  setSearchTitle(e.target.value);
                }}
                onKeyPress={handleKeyPress}
              />
              <ChipInput
                style={{ margin: '10px 0' }}
                value={searchTags}
                onAdd={handleAdd}
                onDelete={handleDelete}
                label='Search Tags'
                variant='outlined'
              />
              <Button
                onClick={searchPost}
                className={classes.searchButton}
                variant='contained'
                color='primary'
              >
                Search&nbsp;<Icon sx={{ color: '#f8f7fc' }}>search</Icon>
              </Button>
            </AppBar>
            <Form currentId={currentId} setCurrentId={setCurrentId} />
            <Paper className={classes.pagination} elevation={6}>
              <Pagination page={page} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Grow>
  );
}
