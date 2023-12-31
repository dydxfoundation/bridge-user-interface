import styled, { css, keyframes, type AnyStyledComponent } from 'styled-components';

type ElementProps = {
  value: number;
};

type StyleProps = {
  className?: string;
  withAnimation?: boolean;
};

export const Ring = ({ className, value, withAnimation }: ElementProps & StyleProps) => {
  const radius = 12;
  const circumference = radius * 2 * Math.PI;
  const offset = Math.max(circumference - circumference * value, 0);

  return (
    <Styled.Ring
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      withAnimation={withAnimation}
    >
      <circle
        cx="16"
        cy="16"
        r={radius}
        stroke="var(--ring-color)"
        strokeWidth="5.5"
        strokeOpacity="0.2"
      />
      <circle
        cx="16"
        cy="16"
        r={radius}
        stroke="var(--ring-color)"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
    </Styled.Ring>
  );
};

const Styled: Record<string, AnyStyledComponent> = {};

Styled.Ring = styled.svg<{ withAnimation?: boolean }>`
  --ring-color: var(--color-accent);

  transform: rotate(-90deg);
  width: 1.25em;
  height: 1.25em;

  ${({ withAnimation }) =>
    withAnimation &&
    css`
      animation: ${keyframes`
    from{
        -webkit-transform: rotate(0deg);
    }
    to{
        -webkit-transform: rotate(360deg);
    }
  `} 2s linear infinite;
    `}
`;
