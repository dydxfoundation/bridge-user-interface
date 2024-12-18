import styled, { AnyStyledComponent } from 'styled-components';

import { STRING_KEYS } from '@/constants/localization';
import breakpoints from '@/styles/breakpoints';
import { useStringGetter } from '@/hooks';

import { Button } from '@/components/Button';
import { Link } from '@/components/Link';

export const Banner = () => {
  const stringGetter = useStringGetter();
  const voteLink = import.meta.env.VITE_PROPOSAL_189;
  const smartContractInfo = import.meta.env.VITE_WETH_DYDX_SMART_CONTRACT;
  const cessationBlogPost = import.meta.env.VITE_CESSATION_OF_WETH_DYDX_SMART_CONTRACT_SUPPORT;

  return voteLink && smartContractInfo && cessationBlogPost ? (
    <Styled.Banner>
      {stringGetter({
        key: STRING_KEYS.BANNER_CEASE_SUPPORT_WETHDYDX,
        params: {
          VOTE: <Link href={voteLink}>{stringGetter({ key: STRING_KEYS.VOTE })}</Link>,
          SMART_CONTRACT: (
            <Link href={smartContractInfo}>
              {stringGetter({ key: STRING_KEYS.WETHDYDX_SMART_CONTRACT })}
            </Link>
          ),
          BLOG_POST: <Link href={cessationBlogPost}>→</Link>,
        },
      })}
    </Styled.Banner>
  ) : null;
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.Banner = styled.div`
  align-items: baseline;
  padding: 1rem;
  text-align: center;

  @media ${breakpoints.tablet} {
    padding: 0.75rem 1rem;
  }

  background-color: var(--color-layer-4);
  font: var(--font-small-book);

  a {
    color: var(--color-accent);
    display: inline;
  }

  a:visited {
    color: var(--color-accent);
  }
`;

Styled.Button = styled(Button)`
  --button-font: var(--font-small-book);
  --button-textColor: var(--color-text-2);
  --button-backgroundColor: var(--color-layer-6);
  --button-border: solid var(--border-width) var(--color-layer-7);
`;
