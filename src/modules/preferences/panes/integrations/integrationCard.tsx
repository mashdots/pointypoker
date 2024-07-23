import React from 'react';
import styled, { css } from 'styled-components';

import { ThemedProps } from '@utils/styles/colors/colorSystem';

type Props = {
  button?: React.ReactNode;
  icon: React.ReactNode;
  isActive: boolean;
  subtitle?: string;
  title: string;
  children?: React.ReactNode;
};

type WrapperProps = {
  isActive: boolean;
};

const Wrapper = styled.div<WrapperProps>`
  ${ ({ isActive, theme }: WrapperProps & ThemedProps) => css`
    background-color: ${theme.greyscale.componentBg};
    border-width: ${ isActive ? 2 : 0 }px;
    border-color: ${ theme.primary.borderElement };
  `};

  border-style: solid;
  width: 100%;
  display: flex;
  padding: 1rem;
  margin-top: 0.5rem;
  border-radius: 0.5rem;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const Header = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const TitleArea = styled.span`
  display: flex;
  align-items: center;
`;

const HeaderTextContainer = styled.span`
  display: flex;
  flex-direction: row;
  align-items: baseline;
`;

const SubtitleText = styled.p`
  ${ ({ theme }: ThemedProps) => css`
    color: ${ theme.greyscale.textLow };
  `}

  margin-left: 1rem;
  font-size: 0.75rem;
`;

const IntegrationCard = ({
  button,
  icon,
  isActive,
  title,
  subtitle,
  children,
}: Props) => (
  <Wrapper isActive={isActive}>
    <Header>
      <TitleArea>
        {icon}
        <HeaderTextContainer>
          <h3>{title}</h3>
          <SubtitleText>{subtitle}</SubtitleText>
        </HeaderTextContainer>
      </TitleArea>
      {button}
    </Header>
    {children}
  </Wrapper>
);

export default IntegrationCard;
