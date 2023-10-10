import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { DialogTypes } from '@/constants/dialogs';

type DialogInfo<TDialog extends DialogTypes> = {
  type: TDialog;
  dialogProps?: any;
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
    addDialogToQueue: (state: DialogsState, action: PayloadAction<DialogInfo<DialogTypes>>) => {
      const dialogQueue = state.dialogQueue;
      dialogQueue.push(action.payload);

      return {
        ...state,
        dialogQueue,
      };
    },
    closeDialog: (state: DialogsState) => ({
      ...state,
      activeDialog: state.dialogQueue.shift(),
    }),
    openDialog: (state: DialogsState, action: PayloadAction<DialogInfo<DialogTypes>>) => ({
      ...state,
      activeDialog: action.payload,
    }),
    closeDialogInTradeBox: (state: DialogsState) => ({
      ...state,
    }),
  },
});

export const { addDialogToQueue, closeDialog, openDialog } = dialogsSlice.actions;
