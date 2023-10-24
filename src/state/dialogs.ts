import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { DialogTypes } from '@/constants/dialogs';

type DialogInfo<TDialog extends DialogTypes> = {
  type: TDialog;
  dialogProps?: any;
  openImmediately?: boolean;
};

export interface DialogsState {
  activeDialog?: DialogInfo<DialogTypes>;
  dialogQueue: DialogInfo<DialogTypes>[];
}

const initialState: DialogsState = {
  activeDialog: undefined,
  dialogQueue: [],
};

export const dialogsSlice = createSlice({
  name: 'Dialogs',
  initialState,
  reducers: {
    closeDialog: (state: DialogsState) => {
      state.activeDialog = state.dialogQueue.shift();
    },
    openDialog: (state: DialogsState, action: PayloadAction<DialogInfo<DialogTypes>>) => {
      if (state.activeDialog?.type === action.payload.type) return;

      if (action.payload.openImmediately) {
        if (state.activeDialog) {
          state.dialogQueue.unshift(state.activeDialog);
        }
        state.activeDialog = action.payload;
      } else if (state.activeDialog) {
        state.dialogQueue.push(action.payload);
      } else {
        state.activeDialog = action.payload;
      }
    },
  },
});

export const { closeDialog, openDialog } = dialogsSlice.actions;
