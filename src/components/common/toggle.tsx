import { JSX } from 'react';

import get from 'lodash/get';
import styled, { css } from 'styled-components';

import { ThemedProps } from '@utils/styles/colors/types';

type ColorOverrides = {
  onbg?: string;
  onIcon?: string;
  offBg?: string;
  offIcon?: string;
};

type Props = {
  isOn: boolean;
  onIcon?: JSX.Element;
  offIcon?: JSX.Element;
  handleToggle: () => void;
  colorOverrides?: ColorOverrides;
  position?: 'left' | 'right';
};

type IconProps = {
  position: 'left' | 'right';
};

const CheckBox = styled.input`
  display: none;
`;

const Wrapper = styled.div<ColorOverrides & { position?: 'left' | 'right' }>`
  ${({ position }: { position?: 'left' | 'right' }) => position === 'left' ? css`
    margin: 0 0.5rem 0 0;
  ` : css`
    margin: 0 0 0 0.5rem;
  `}
  display: flex;
  align-items: center;
  justify-content: center;
  
  input:checked + #slider {
    ${({ onbg, theme }: ColorOverrides & ThemedProps) => {
      const finalColor = onbg ? get(theme, onbg) : theme.success.accent9;

      return css`
        background-color: ${finalColor};
      `;
    }}

    transition: background-color 0.25s ease-out;
  }
`;

const Slider = styled.div <Pick<Props, 'isOn'> & ColorOverrides>`
  ${({
    isOn,
    offBg,
    theme,
  }: Pick<Props, 'isOn'> & ThemedProps & ColorOverrides) => css`
    background-color: ${ offBg ? get(theme, offBg) : theme.primary.accent3 };
    border: 1px solid ${ isOn ? theme.primary.accent7 : theme.primary.accent12 };

    > span {
      transition: transform 0.25s cubic-bezier(.54, 1.60, .5, 1);
      transform: translateX(${ isOn ? 1 : -1 }rem);
    }
  `}

  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 2rem;
  border-radius: 1rem;
  position: relative;
  cursor: pointer;
  overflow: hidden;
`;

const ToggleKnob = styled.span`
  ${({ theme }: ThemedProps) => css`
    background-color: ${ theme.primary.accent3 };
    outline: 1px solid ${ theme.primary.accent7 };
  `}

  content: '';
  display: block;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  position: absolute;
`;

const Icon = styled.span<IconProps>`
  ${({ position }: IconProps & ThemedProps) => position === 'left' ? css`
    left: -0.5rem;
  ` : css`
    right: -0.5rem;
  `}

  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
`;

const Toggle = ({
  isOn,
  handleToggle,
  colorOverrides,
  offIcon,
  onIcon,
  position,
}: Props) => (
  <Wrapper onClick={handleToggle} {...colorOverrides}
    position={position}>
    <CheckBox
      type="checkbox"
      checked={isOn}

      onChange={() => {}}
    />
    <Slider isOn={isOn} id='slider'
      {...colorOverrides}>
      <Icon position='left'>
        {onIcon}
      </Icon>
      <ToggleKnob />
      <Icon position='right'>
        {offIcon}
      </Icon>
    </Slider>
  </Wrapper>
);

export default Toggle;
