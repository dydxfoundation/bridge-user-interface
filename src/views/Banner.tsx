import { layoutMixins } from '@/styles/layoutMixins';
import styled, { AnyStyledComponent } from 'styled-components';

import { ButtonSize, ButtonType } from '@/constants/buttons';
import { STRING_KEYS } from '@/constants/localization';
import breakpoints from '@/styles/breakpoints';
import { useStringGetter } from '@/hooks';

import { Button } from '@/components/Button';

export const Banner = () => {
  const stringGetter = useStringGetter();
  const stakingLearnMoreLink = import.meta.env.VITE_STAKING_LEARN_MORE_LINK;
  const launchBlogPostLink = import.meta.env.VITE_LAUNCH_BLOG_POST_LINK;

  return !(stakingLearnMoreLink || launchBlogPostLink) ? null : (
    <Styled.Banner>
      {stakingLearnMoreLink && (
        <Styled.Button size={ButtonSize.XSmall} href={stakingLearnMoreLink} type={ButtonType.Link}>
          {stringGetter({ key: STRING_KEYS.HOW_TO_STAKE })}
        </Styled.Button>
      )}
      {launchBlogPostLink && (
        <Styled.Button size={ButtonSize.XSmall} href={launchBlogPostLink} type={ButtonType.Link}>
          {stringGetter({ key: STRING_KEYS.READ_LAUNCH_BLOG_POST })}
        </Styled.Button>
      )}
    </Styled.Banner>
  );
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.Banner = styled.div`
  ${layoutMixins.row}
  align-items: baseline;
  gap: 0.5rem;

  flex-wrap: wrap;
  justify-content: center;
  padding: 0.5rem 1rem;
  text-align: center;

  @media ${breakpoints.tablet} {
    padding: 0.75rem 1rem;
  }

  background-color: var(--color-layer-4);
  font: var(--font-small-book);
`;

Styled.Button = styled(Button)`
  --button-font: var(--font-small-book);
  --button-textColor: var(--color-text-2);
  --button-backgroundColor: var(--color-layer-6);
  --button-border: solid var(--border-width) var(--color-layer-7);
`;
