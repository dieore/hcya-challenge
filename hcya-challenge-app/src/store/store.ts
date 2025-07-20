import { configureStore } from "@reduxjs/toolkit";
import tabsReducer from "../store/tabs/tabsSlice";
import snackbarReducer from "./snackbar/snackbarSlice";

export const store = configureStore({
  reducer: {
    tabs: tabsReducer,
    snackbar: snackbarReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
