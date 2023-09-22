import styled, { AnyStyledComponent, css } from "styled-components";
import { WagmiConfig } from "wagmi";
import { QueryClient, QueryClientProvider } from "react-query";

import { AccountsProvider } from "@/hooks/useAccounts";
import { useBreakpoints, useInitializePage } from "@/hooks";
import { DydxProvider } from "@/hooks/useDydxClient";
import { DialogAreaProvider, useDialogArea } from "@/hooks/useDialogArea";
import { LocaleProvider } from "@/hooks/useLocaleSeparators";
import { MigrateTokenProvider } from "@/hooks/useMigrateToken";

import { config } from "@/lib/wagmi";

import { layoutMixins } from "@/styles/layoutMixins";
import breakpoints from "@/styles/breakpoints";

import { HeaderDesktop } from "@/views/HeaderDesktop";
import { MigratePanel } from "@/views/MigratePanel";
import { DialogManager } from "@/views/dialogs/DialogManager";

import "@/styles/constants.css";
import "@/styles/web3modal.css";

const queryClient = new QueryClient();

const Content = () => {
  const { setDialogArea } = useDialogArea();

  useInitializePage();

  const { isNotTablet } = useBreakpoints();
  const isShowingHeader = isNotTablet;

  return (
    <Styled.Content isShowingHeader={isShowingHeader}>
      {isNotTablet && <HeaderDesktop />}

      <Styled.Main>
        <Styled.Container>
          <MigratePanel />
        </Styled.Container>
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
            <DialogAreaProvider>
              <MigrateTokenProvider>
                <Content />
              </MigrateTokenProvider>
            </DialogAreaProvider>
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
  ${layoutMixins.contentSectionAttached}

  grid-area: Main;

  isolation: isolate;

  position: relative;
`;

Styled.Container = styled.div`
  ${layoutMixins.horizontallyCentered}
  padding: 2.5rem;
`;

Styled.DialogArea = styled.aside`
  position: fixed;
  height: 100vh;
  z-index: 1;
  inset: 0;
  overflow: clip;
  ${layoutMixins.noPointerEvents}
`;

export default App;
