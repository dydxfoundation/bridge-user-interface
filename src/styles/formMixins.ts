import { css } from 'styled-components';

import { layoutMixins } from './layoutMixins';
import breakpoints from './breakpoints';

export const formMixins: Record<string, any> = {
  inputsColumn: css`
    ${layoutMixins.flexColumn}
    gap: var(--form-input-gap);
  `,

  inputContainer: css`
    --input-radius: 0.5em;
    --input-height: var(--form-input-height);
    --input-width: 100%;
    --input-backgroundColor: var(--color-layer-4);
    --input-borderColor: var(--color-layer-6);

    ${layoutMixins.row}
    justify-content: space-between;
    width: var(--input-width);
    min-width: var(--input-width);
    flex: 1;

    height: var(--input-height);
    min-height: var(--input-height);

    background-color: var(--input-backgroundColor);
    border: var(--border-width) solid var(--input-borderColor);
    border-radius: var(--input-radius);

    &:focus-within {
      filter: brightness(1.1);
    }

    @media ${breakpoints.tablet} {
      --input-height: var(--form-input-height-mobile);
    }
  `,

  inputInnerButton: css`
    --button-textColor: var(--color-text-1);
    --button-backgroundColor: var(--color-layer-5);
    --button-border: var(--border-width) solid var(--color-layer-6);
  `,

  inputInnerToggleButton: css`
    ${() => formMixins.inputInnerButton}

    --button-toggle-off-backgroundColor: var(--color-layer-5);
    --button-toggle-off-textColor: var(--color-text-1);
    --button-toggle-on-backgroundColor: var(--color-layer-5);
    --button-toggle-on-textColor: var(--color-text-1);
  `,

  inputLabel: css`
    position: relative;
    height: 100%;
    width: 100%;
    gap: 0.25rem;

    border-radius: inherit;
  `,
};
