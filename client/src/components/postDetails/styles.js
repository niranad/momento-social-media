import { makeStyles } from '@material-ui/core';

export default makeStyles((theme) => ({
  media: {
    borderRadius: '20px',
    objectFit: 'cover',
    width: '100%',
    maxHeight: '600px',
  },
  card: {
    display: 'flex',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      flexWrap: 'wrap',
      flexDirection: 'column',
    },
  },
  message: {
    fontSize: '20px',
    fontFamily: 'Roboto, Calibri, sans-serif',
    [theme.breakpoints.down('sm')]: {
      fontSize: '16px'
    }
  },
  section: {
    borderRadius: '20px',
    margin: '20px',
    flex: 1,
  },
  imageSection: {
    marginLeft: '20px',
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
    },
  },
  recommendedPosts: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  loadingPaper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    borderRadius: '15px',
    height: '39vh',
  },
  commentsOuterContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      display: 'block',
    },
  },
  commentsInnerContainer: {
    height: '200px',
    overflowY: 'auto',
    marginRight: '30px',
  },
  comment: {
    backgroundColor: '#e9e9e9',
    cursor: 'pointer',
    padding: '15px',
    textJustify: 'left',
    fontFamily: 'Sora, OpenSans, Verdana, Cambria, serif',
    borderRadius: '7px',
    margin: '4px',
  },
}));
