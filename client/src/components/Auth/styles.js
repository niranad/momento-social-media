import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(8),
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      display: 'block',
      textAlign: 'center',
    },
  },
  modalBox: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    bgcolor: '#f8f7fc',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  logotext: {
    fontWeight: 700,
    letterSpacing: '-4px',
    color: 'rgba(0, 170, 255, 1)',
    [theme.breakpoints.down('xs')]: {
      fontSize: 28,
      letterSpacing: -1
    }
  },
  brandpitch: {
    [theme.breakpoints.down('xs')]: {
      fontSize: 18
    }
  },
  emailBox: {
    textAlign: 'center',
    paddingTop: 40,
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  intro: {
    marginRight: '40px',
  },
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
    },
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  googleButton: {
    marginBottom: theme.spacing(2),
  },
}));
