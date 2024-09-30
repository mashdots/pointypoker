import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';

import ArticleSvg from '@assets/icons/article.svg?react';
import { ThemedProps } from '@utils/styles/colors/colorSystem';

type Props = {
  src?: string;
  ticketUrl?: string;
}

type WrapperProps = {
  isVisible: boolean;
}

const Wrapper = styled.div<WrapperProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 3rem;
  width: 3rem;
  margin: 0 0.5rem;
  transition: all 250ms;

  ${ ({ isVisible }: WrapperProps) => css`
    opacity: ${ isVisible ? 1 : 0 };
    transform: scale(${ isVisible ? 1 : 0.75 });
    filter: blur(${isVisible ? 0 : 0.5}rem);
  `}
`;

const DefaultIcon = styled(ArticleSvg)`
  ${ ({ theme }: ThemedProps) => css`
    > line, rect {
      stroke: ${ theme.primary.accent11};
    }
  `}
  
  width: 2rem;
`;

const Icon = styled.img`
  height: 2rem;
  width: 2rem;
  border-radius: 0.25rem;
`;

let timeout: number;

const IssueIcon = ({ src = '', ticketUrl }: Props) => {
  const [ isIconVisible, setIsIconVisible ] = useState(false);
  const [ icon, setIcon ] = useState<string | null>(null);

  /**
   * Over-engineered logic to make the icon animate in and out
  */
  useEffect(() => {
    clearTimeout(timeout);

    if (src !== icon) {
      setIsIconVisible(false);

      timeout = setTimeout(() => {
        setIcon(src ?? '');
      }, 200);
    }

    timeout = setTimeout(() => {
      setIsIconVisible(true);
    }, 300);

    return () => {
      clearTimeout(timeout);
    };
  }, [ src, icon ]);

  const iconComponent = icon ? (
    <a href={ticketUrl} target='_blank' rel="noreferrer">
      <Icon
        src={icon}
        alt='Ticket icon'
        onError={({ currentTarget }) => {
          currentTarget.onerror = null;
          currentTarget.src = 'https://v1.icons.run/64/ph/binoculars.png?color=FFFFFF&bg=e5484d';
        }}
      />
    </a>
  ) : <DefaultIcon />;

  return (
    <Wrapper isVisible={isIconVisible} >
      {iconComponent}
    </Wrapper>
  );
};

export default IssueIcon;
