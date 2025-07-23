import { configureStore } from "@reduxjs/toolkit";
import tabsReducer from "../store/tabs/tabsSlice";
import snackbarReducer from "./snackbar/snackbarSlice";
import dirtyReducer from './dirty/dirtySlice';
import modalReducer from './modal/modalSlice';

export const store = configureStore({
  reducer: {
    tabs: tabsReducer,
    snackbar: snackbarReducer,
    dirty: dirtyReducer,
    modal: modalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['modal/openModal'],
        ignoredPaths: ['modal.onConfirm'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type SerializableFunction = (...args: any[]) => void;
