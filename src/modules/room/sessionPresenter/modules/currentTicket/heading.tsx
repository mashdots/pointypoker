import React from 'react';
import styled, { css } from 'styled-components';

import ArticleSvg from '@assets/icons/article.svg?react';
import PlusSvg from '@assets/icons/plus.svg?react';
import ReportSvg from '@assets/icons/megaphone.svg?react';
import SkipSvg from '@assets/icons/skip.svg?react';
import { ThemedProps } from '@utils/styles/colors/colorSystem';
import { ButtonMenu } from '@components/common';

type Props = {
  iconUrl: string;
  id: string;
  sprint: string;
  title: string;
  type: string;
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 1rem;
`;

const Icon = styled.img`
  height: 3rem;
  width: 3rem;
  border-radius: 0.25rem;
`;

const DefaultIcon = styled(ArticleSvg)`
  ${ ({ theme }: ThemedProps) => css`
    > line, rect {
      stroke: ${ theme.primary.accent11 };
    }
  `}
  
  width: 2rem;
`;

const SkipIcon = styled(SkipSvg)`
  ${ ({ theme }: ThemedProps) => css`
    > polyline, path {
      stroke: ${ theme.error.accent11 };
    }

    > circle {
      stroke: ${ theme.greyscale.accent11 };
    }
  `};

  width: 1.5rem;
  margin-right: 0.75rem;
`;

const NewIcon = styled(PlusSvg)`
  ${ ({ theme }: ThemedProps) => css`
    > line {
      stroke: ${ theme.warning.accent11 };
    }
  `};

  width: 1.5rem;
  margin-right: 0.75rem;
`;

const ReportIcon = styled(ReportSvg)`
  ${ ({ theme }: ThemedProps) => css`
    > path {
      stroke: ${ theme.error.accent11 };
    }
  `};

  width: 1.5rem;
  margin-right: 0.75rem;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: flex-end;
`;

const Title = styled.h2`
  font-weight: 500;
`;

const MenuButtonContainer = styled.span`
  display: flex;
  margin-left: 0.5rem;
  position: relative;
`;

const Metadata = styled.div`
  ${ ({ theme }: ThemedProps) => css`
    color: ${ theme.greyscale.accent11 };
  `}
  display: flex;
  flex-direction: row;
  align-items: center;

  > p {
    margin: 0;
    font-size: 0.75rem;
    font-weight: 300;
    
    :first-child {
      ::after {
        content: '|';
        margin-left: 1rem;
      }
    }
    
    :last-child {
      margin-left: 1rem;
    }
  }
`;

const Heading = ({
  iconUrl,
  title,
  id,
  sprint,
  type,
}: Props) => {
  if (!title) {
    return null;
  }

  // Temporary until we're properly storing icon data
  const iconComponent = iconUrl ? <Icon src={iconUrl} /> : <DefaultIcon />;

  const menuItems = [
    {
      icon: <NewIcon />,
      label: 'New',
      onClick: () => { },
    },
    {
      icon: <SkipIcon />,
      label: 'Skip',
      onClick: () => {},
    },
    {
      icon: <ReportIcon />,
      label: 'Report PII',
      onClick: () => {},
    },
  ];

  return (
    <Wrapper>
      <IconContainer title={type}>
        {iconComponent}
      </IconContainer>
      <HeaderContainer>
        <TitleWrapper>
          <Title>
            {title}
          </Title>
          <MenuButtonContainer>
            <ButtonMenu menuItems={menuItems} size='small' isSimple shouldShow />
          </MenuButtonContainer>
        </TitleWrapper>
        <Metadata>
          <p>{id}</p><p>{sprint}</p>
        </Metadata>
      </HeaderContainer>
    </Wrapper>);
};

export default Heading;
