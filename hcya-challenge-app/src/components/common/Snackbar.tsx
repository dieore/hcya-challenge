import { Alert, Snackbar as MuiSnackbar } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { hideSnackbar } from '../../store/snackbar/snackbarSlice';

const CustomSnackbar = () => {
  const dispatch = useAppDispatch();
  const { open, message, severity } = useAppSelector((state) => state.snackbar);

  const handleClose = () => {
    dispatch(hideSnackbar());
  };

  return (
    <MuiSnackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </MuiSnackbar>
  );
};

export default CustomSnackbar;
