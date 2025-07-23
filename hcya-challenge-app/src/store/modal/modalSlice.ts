import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const initialState: ModalState = {
  isOpen: false,
  title: '',
  message: '',
  onConfirm: undefined,
  onCancel: undefined,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<Omit<ModalState, 'isOpen'>>) => {
      state.isOpen = true;
      state.title = action.payload.title;
      state.message = action.payload.message;
      state.onConfirm = action.payload.onConfirm;
      state.onCancel = action.payload.onCancel;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.title = '';
      state.message = '';
      state.onConfirm = undefined;
      state.onCancel = undefined;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
