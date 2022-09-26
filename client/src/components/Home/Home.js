import React, { useState, useEffect } from 'react';
import {
  Grow,
  Container,
  Grid,
  Paper,
  AppBar,
  Button,
  TextField,
  Icon,
  Collapse,
  CircularProgress,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { getPostsBySearch } from '../../actions/posts';
import { useDispatch, useSelector } from 'react-redux';
import Posts from '../Posts/Posts';
import { useHistory, useLocation } from 'react-router-dom';
import ChipInput from 'material-ui-chip-input';
import Pagination from '../Pagination';
import Form from '../Form/Form';
import useStyles from './styles';
import { SET_TRANSIENT_STATE } from '../../constants/actiontypes';

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
  const [openAlert, setOpenAlert] = useState(true);
  const { isFetchingBySearch, fetchBySearchFailed, searchIsEmpty } =
    useSelector(({ posts }) => posts);

  const searchPost = async () => {
    if (searchTitle.trim() || searchTags.length > 0) {
      await dispatch(
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

  useEffect(() => {
    if (fetchBySearchFailed || searchIsEmpty) {
      if (!openAlert) setOpenAlert(true);

      const timeout = setTimeout(() => {
        setOpenAlert(true);

        dispatch({ type: SET_TRANSIENT_STATE });
      }, 2000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [fetchBySearchFailed, searchIsEmpty]);

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
                placeholder='tag without # and press enter'
                variant='outlined'
              />
              {fetchBySearchFailed || searchIsEmpty ? (
                <Collapse in={openAlert}>
                  <Alert
                    style={{ marginTop: 7, fontSize: 16 }}
                    severity='error'
                  >
                    {fetchBySearchFailed
                      ? 'Failed to search posts'
                      : 'No post with the search criteria'}
                  </Alert>
                </Collapse>
              ) : (
                ''
              )}
              <Button
                onClick={searchPost}
                className={classes.searchButton}
                variant='contained'
                color='primary'
              >
                Search&nbsp;
                {isFetchingBySearch ? (
                  <CircularProgress size='18px' sx={{ color: '#fff' }} />
                ) : (
                  <Icon sx={{ color: '#f8f7fc' }}>search</Icon>
                )}
              </Button>
            </AppBar>
            <Form currentId={currentId} setCurrentId={setCurrentId} />
          </Grid>
        </Grid>
        <Paper className={classes.pagination} elevation={6}>
          <Pagination page={page} />
        </Paper>
      </Container>
    </Grow>
  );
}
