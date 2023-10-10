import { type RootState } from './_store';

export const getActiveDialog = (state: RootState) => state.dialogs.activeDialog;
