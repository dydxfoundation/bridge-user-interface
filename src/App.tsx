import { Route, Routes } from 'react-router-dom';

import styled, { AnyStyledComponent } from 'styled-components';
import { WagmiConfig } from 'wagmi';
import { QueryClient, QueryClientProvider } from 'react-query';

import { STRING_KEYS } from './constants/localization';
import { MigrateTabs } from '@/constants/migrate';
import { AppRoute } from '@/constants/routes';

import { AccountsProvider } from '@/hooks/useAccounts';
import { AccountBalanceProvider } from '@/hooks/useAccountBalance';
import { useInitializePage, useStringGetter } from '@/hooks';
import { DydxProvider } from '@/hooks/useDydxClient';
import { DialogAreaProvider, useDialogArea } from '@/hooks/useDialogArea';
import { LocaleProvider } from '@/hooks/useLocaleSeparators';
import { MigrateTokenProvider, useMigrateToken } from '@/hooks/useMigrateToken';
import { RestrictionProvider } from '@/hooks/useRestrictions';

import { layoutMixins } from '@/styles/layoutMixins';
import breakpoints from '@/styles/breakpoints';

import { Tabs } from '@/components/Tabs';

import { Banner } from '@/views/Banner';
import { Header } from '@/views/Header';
import { MigratePage } from '@/views/MigratePage';
import { PendingMigrationsPage } from '@/views/PendingMigrationsPage';
import { DialogManager } from '@/views/dialogs/DialogManager';
import { TermsOfUsePage } from '@/views/TermsOfUsePage';
import { PrivacyPolicyPage } from '@/views/PrivacyPolicyPage';

import { config } from '@/lib/wagmi';

import '@/styles/constants.css';
import '@/styles/web3modal.css';

const queryClient = new QueryClient();

const Content = () => {
  const stringGetter = useStringGetter();
  const { setDialogArea } = useDialogArea();

  useInitializePage();

  const { selectedTab, setSelectedTab } = useMigrateToken();

  return (
    <Styled.Content>
      <Banner />
      <Header />

      <Styled.Main>
        <Routes>
          <Route
            path="/"
            element={
              <Styled.Tabs
                defaultValue={MigrateTabs.Migrate}
                value={selectedTab}
                onValueChange={setSelectedTab}
                items={[
                  {
                    value: MigrateTabs.Migrate,
                    label: stringGetter({ key: STRING_KEYS.MIGRATE }),
                    forceMount: true,
                    content: <MigratePage />,
                  },
                  {
                    value: MigrateTabs.PendingMigrations,
                    label: stringGetter({
                      key: STRING_KEYS.PENDING_MIGRATIONS,
                    }),
                    forceMount: true,
                    content: <PendingMigrationsPage />,
                  },
                ]}
              />
            }
          />

          <Route path={AppRoute.Terms} element={<TermsOfUsePage />} />
          <Route path={AppRoute.Privacy} element={<PrivacyPolicyPage />} />
        </Routes>
      </Styled.Main>

      <Styled.DialogArea ref={setDialogArea}>
        <DialogManager />
      </Styled.DialogArea>
    </Styled.Content>
  );
};

const wrapProvider = (Component: React.ComponentType<any>, props?: any) => {
  return ({ children }: { children: React.ReactNode }) => (
    <Component {...props}>{children}</Component>
  );
};

const providers = [
  wrapProvider(QueryClientProvider, { client: queryClient }),
  wrapProvider(WagmiConfig, { config }),
  wrapProvider(LocaleProvider),
  wrapProvider(DydxProvider),
  wrapProvider(AccountsProvider),
  wrapProvider(RestrictionProvider),
  wrapProvider(AccountBalanceProvider),
  wrapProvider(MigrateTokenProvider),
  wrapProvider(DialogAreaProvider),
];

const App = () => {
  return [...providers].reverse().reduce((children, Provider) => {
    return <Provider>{children}</Provider>;
  }, <Content />);
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.Content = styled.div`
  /* Computed */
  --page-currentHeaderHeight: var(--page-header-height);

  @media ${breakpoints.tablet} {
    --page-currentHeaderHeight: var(--page-header-height-mobile);
  }

  /* Rules */
  ${layoutMixins.contentContainer}
  ${layoutMixins.scrollArea}
  --scrollArea-height: 100vh;

  @supports (-webkit-touch-callout: none) {
    height: -webkit-fill-available;
  }

  ${layoutMixins.stickyArea0}
  --stickyArea0-topHeight: var(--page-currentHeaderHeight);
  --stickyArea0-topGap: var(--border-width);

  ${layoutMixins.withOuterAndInnerBorders}

  display: flex;
  transition: 0.3s var(--ease-out-expo);
`;

Styled.Main = styled.main`
  grid-area: Main;
  margin: 0 auto;
  box-shadow: none;
  padding-top: 2rem;

  @media ${breakpoints.tablet} {
    padding-top: 1rem;
  }
`;

Styled.DialogArea = styled.aside`
  position: fixed;
  height: 100%;
  z-index: 1;
  inset: 0;
  overflow: clip;
  ${layoutMixins.noPointerEvents}
`;

Styled.Tabs = styled(Tabs)`
  margin-bottom: 2rem;

  header {
    font: var(--font-medium-book);

    @media ${breakpoints.tablet} {
      margin: 0 1.5rem;
    }
  }
`;

export default App;
