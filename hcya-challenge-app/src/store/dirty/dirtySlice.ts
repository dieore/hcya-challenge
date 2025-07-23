import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface DirtyState {
  [model: string]: {
    [key: string]: boolean;
  };
}

const initialState: DirtyState = {};

const dirtySlice = createSlice({
  name: 'dirty',
  initialState,
  reducers: {
    setDirtyState: (state, action: PayloadAction<{ model: string; key: string; isDirty: boolean }>) => {
      state[action.payload.model] = {
        ...state[action.payload.model],
        [action.payload.key]: action.payload.isDirty
      }
    },
    resetDirtyState: () => initialState,  
  },
});

export const { setDirtyState, resetDirtyState } = dirtySlice.actions;

export default dirtySlice.reducer;
