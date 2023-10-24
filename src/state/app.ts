import { createSlice } from '@reduxjs/toolkit';

export interface AppState {
  pageLoaded: boolean;
}

const initialState: AppState = {
  pageLoaded: false,
};

export const appSlice = createSlice({
  name: 'App',
  initialState,
  reducers: {
    initializeLocalization: (state: AppState) => ({
      ...state,
      pageLoaded: true,
    }),
  },
});

export const { initializeLocalization } = appSlice.actions;
