import styled, { AnyStyledComponent, css } from "styled-components";
import { WagmiConfig } from "wagmi";
import { QueryClient, QueryClientProvider } from "react-query";

import { AccountsProvider } from "@/hooks/useAccounts";
import { AccountBalanceProvider } from "@/hooks/useAccountBalance";
import { useBreakpoints, useInitializePage } from "@/hooks";
import { DydxProvider } from "@/hooks/useDydxClient";
import { DialogAreaProvider, useDialogArea } from "@/hooks/useDialogArea";
import { LocaleProvider } from "@/hooks/useLocaleSeparators";
import { MigrateTokenProvider, useMigrateToken } from "@/hooks/useMigrateToken";

import { config } from "@/lib/wagmi";

import { layoutMixins } from "@/styles/layoutMixins";
import breakpoints from "@/styles/breakpoints";

import { MigrateTabs } from "@/constants/migrate";

import { Tabs } from "@/components/Tabs";

import { HeaderDesktop } from "@/views/HeaderDesktop";
import { MigratePage } from "@/views/MigratePage";
import { PendingMigrationsPage } from "@/views/PendingMigrationsPage";
import { DialogManager } from "@/views/dialogs/DialogManager";

import "@/styles/constants.css";
import "@/styles/web3modal.css";

const queryClient = new QueryClient();

const Content = () => {
  const { setDialogArea } = useDialogArea();

  useInitializePage();

  const { isNotMobile } = useBreakpoints();
  const isShowingHeader = isNotMobile;

  const { selectedTab, setSelectedTab } = useMigrateToken();

  return (
    <Styled.Content isShowingHeader={isShowingHeader}>
      {isNotMobile && <HeaderDesktop />}

      <Styled.Main>
        <Styled.Tabs
          defaultValue={MigrateTabs.Migrate}
          value={selectedTab}
          onValueChange={setSelectedTab}
          items={[
            {
              value: MigrateTabs.Migrate,
              label: "Migrate",
              forceMount: true,
              content: <MigratePage />,
            },
            {
              value: MigrateTabs.PendingMigrations,
              label: "Pending Migrations",
              forceMount: true,
              content: <PendingMigrationsPage />,
            },
          ]}
        />
      </Styled.Main>

      <Styled.DialogArea ref={setDialogArea}>
        <DialogManager />
      </Styled.DialogArea>
    </Styled.Content>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <WagmiConfig config={config}>
      <LocaleProvider>
        <DydxProvider>
          <AccountsProvider>
            <AccountBalanceProvider>
              <MigrateTokenProvider>
                <DialogAreaProvider>
                  <Content />
                </DialogAreaProvider>
              </MigrateTokenProvider>
            </AccountBalanceProvider>
          </AccountsProvider>
        </DydxProvider>
      </LocaleProvider>
    </WagmiConfig>
  </QueryClientProvider>
);

const Styled: Record<string, AnyStyledComponent> = {};

Styled.Content = styled.div<{
  isShowingHeader: boolean;
}>`
  /* Computed */
  --page-currentHeaderHeight: 0px;
  --page-currentFooterHeight: 0px;

  ${({ isShowingHeader }) =>
    isShowingHeader &&
    css`
      --page-currentHeaderHeight: var(--page-header-height);

      @media ${breakpoints.tablet} {
        --page-currentHeaderHeight: var(--page-header-height-mobile);
      }
    `}

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
  --stickyArea0-bottomGap: var(--border-width);
  --stickyArea0-bottomHeight: var(--page-currentFooterHeight);

  ${layoutMixins.withOuterAndInnerBorders}
  display: grid;
  grid-template:
    "Header" var(--page-currentHeaderHeight)
    "Main" minmax(min-content, 1fr)
    "Footer" var(--page-currentFooterHeight)
    / 100%;

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
  height: 100vh;
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
