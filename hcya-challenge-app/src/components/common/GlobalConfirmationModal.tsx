import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { closeModal } from '../../store/modal/modalSlice';

export default function GlobalConfirmationModal() {
  const {
    isOpen,
    title,
    message,
    onConfirm,
    onCancel
  } = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    if (onCancel) {
      onCancel();
    }
    dispatch(closeModal());
  };

  const handleConfirm = () => {
    if (onConfirm) {
      // @ts-ignore
      onConfirm();
    }
    handleClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleConfirm} color="primary">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
