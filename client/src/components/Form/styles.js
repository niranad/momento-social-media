import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
    },
  },
  paper: {
    padding: theme.spacing(2),
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  fileInput: {
    width: '97%',
    margin: '10px 0',
    textTransform: 'none',
  },
  buttonSubmit: {
    marginBottom: 10,
  },
  imgPreview: {
    margin: '10px 0',
    width: '97%',
    padding: 8,
    height: '150px',
    boxShadow: '1px 2px 6px 2px rgba(0, 0, 0, 0.85)',
  },
  picture: {
    width: '100%',
    height: '100%',
  },
}));
