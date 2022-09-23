import { makeStyles } from '@material-ui/core';
import { deepPurple } from '@material-ui/core/colors';

export default makeStyles((theme) => ({
  appBar: {
    borderRadius: 15,
    margin: '30px 0',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 30px',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  heading: {
    color: 'rgba(0, 170, 255, 1)',
    textDecoration: 'none',
    fontFamily: 'Calibri',
    fontWeight: '600',
    letterSpacing: '-5px',
    [theme.breakpoints.down('xs')]: {
      fontSize: 28,
      letterSpacing: '-1px',
    },
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '400px',
    [theme.breakpoints.down('sm')]: {
      width: 'auto',
    },
  },
  profile: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '400px',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      width: 'auto',
      marginTop: 20,
      justifyContent: 'center',
    },
  },
  logout: {
    marginLeft: '20px',
    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
      letterSpacing: 'normal',
      width: 'fit-content'
    },
  },
  userName: {
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    [theme.breakpoints.down('xs')]: {
      fontSize: 16,
      letterSpacing: 'normal',
    },
  },
  brandContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },
}));