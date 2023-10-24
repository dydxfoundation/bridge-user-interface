import { configureStore } from '@reduxjs/toolkit';

import localizationMiddleware from './localizationMiddleware';

import { accountSlice } from './account';
import { appSlice } from './app';
import { dialogsSlice } from './dialogs';
import { localizationSlice } from './localization';

export const store = configureStore({
  reducer: {
    account: accountSlice.reducer,
    app: appSlice.reducer,
    dialogs: dialogsSlice.reducer,
    localization: localizationSlice.reducer,
  },

  middleware: (getDefaultMiddleware: any) => [
    ...getDefaultMiddleware({
      serializableCheck: false,
    }),
    localizationMiddleware,
  ],

  devTools: process.env.NODE_ENV !== 'production',
});

export type RootStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
