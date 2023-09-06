import { FormEvent } from "react";
import styled, { AnyStyledComponent } from "styled-components";

import breakpoints from "@/styles/breakpoints";
import { formMixins } from "@/styles/formMixins";
import { layoutMixins } from "@/styles/layoutMixins";

import { MigrateFormSteps } from "@/constants/migrate";

import { useMigrateToken } from "@/hooks/useMigrateToken";

import { Icon, IconName } from "@/components/Icon";
import { Panel } from "@/components/Panel";
import { Ring } from "@/components/Ring";
import { VerticalSeparator } from "@/components/Separator";

import { MigrateFormEditingStep } from "./MigrateForm/EditingStep/MigrateFormEditingStep";
import { MigrateFormPreviewStep } from "./MigrateForm/PreviewStep/MigrateFormPreviewStep";
import { MigrateFormConfirmedStep } from "./MigrateForm/ConfirmedStep/MigrateFormConfirmedStep";

export const MigratePanel = () => {
  const { currentStep, onFormSubmit } = useMigrateToken();

  const { slotIcon, title, subtitle, content } = {
    [MigrateFormSteps.Edit]: {
      slotIcon: <Icon iconName={IconName.Migrate} />,
      title: "Migrate",
      subtitle: (
        <span>
          from <b>Ethereum</b> to <b>dYdX Chain</b>
        </span>
      ),
      content: <MigrateFormEditingStep />,
    },
    [MigrateFormSteps.Preview]: {
      title: "Confirm migration",
      subtitle: (
        <span>
          to <b>dYdX Chain</b>
        </span>
      ),
      content: <MigrateFormPreviewStep />,
    },
    [MigrateFormSteps.Confirmed]: {
      slotIcon: <Ring withAnimation value={0.25} />,
      title: "Sending...",
      subtitle: (
        <span>
          to <b>dYdX Chain</b>
        </span>
      ),
      content: <MigrateFormConfirmedStep />,
    },
  }[currentStep];

  return (
    <Styled.MigrateCard
      slotHeader={
        <Styled.Header>
          <h3>
            {slotIcon}
            {title}
          </h3>
          <Styled.VerticalSeparator />
          {subtitle}
        </Styled.Header>
      }
    >
      <Styled.Form
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          onFormSubmit();
        }}
      >
        {content}
      </Styled.Form>
    </Styled.MigrateCard>
  );
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.MigrateCard = styled(Panel)`
  max-width: 25rem;
  width: 100%;

  @media ${breakpoints.tablet} {
    max-width: 100%;
  }
`;

Styled.Header = styled.div`
  ${layoutMixins.inlineRow}
  gap: 1ch;

  h3 {
    ${layoutMixins.inlineRow}
    font: var(--font-large-book);
    color: var(--color-text-2);

    svg {
      font-size: 1.75rem;
    }
  }

  span {
    margin-top: 0.2rem;
    color: var(--color-text-0);
    b {
      color: var(--color-text-1);
    }
  }
`;

Styled.VerticalSeparator = styled(VerticalSeparator)`
  z-index: 1;

  && {
    height: 1.5rem;
  }

  @media ${breakpoints.tablet} {
    display: none;
  }
`;

Styled.Form = styled.form`
  ${formMixins.inputsColumn}
  gap: 1.25rem;
`;
