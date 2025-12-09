import { AnimatePresence } from 'motion/react';
import { div as Wrapper } from 'motion/react-client';
import React from 'react';

import styled, { css } from 'styled-components';

import ArticleSvg from '@assets/icons/article.svg?react';
import { ThemedProps } from '@utils/styles/colors/colorSystem';

type Props = {
  src?: string;
  ticketUrl?: string;
};

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

const IssueIcon = ({ src = '', ticketUrl }: Props) => (
  <AnimatePresence mode='wait'>
    <Wrapper
      key={src || 'default'}
      initial={{
        filter: 'blur(0.5rem)',
        opacity: 0,
        scale: 0.75,
      }}
      animate={{
        filter: 'blur(0rem)',
        opacity: 1,
        scale: 1,
      }}
      exit={{
        filter: 'blur(0.5rem)',
        opacity: 0,
        scale: 0.75,
      }}
      transition={{ duration: 0.25 }}
      style={{
        alignItems: 'center',
        display: 'flex',
        height: '3rem',
        justifyContent: 'center',
        margin: '0 0.5rem',
        width: '3rem',
      }}
    >
      {src ? (
        <a href={ticketUrl} target='_blank'
          rel="noreferrer">
          <Icon
            src={src}
            alt='Ticket icon'
          />
        </a>
      ) : <DefaultIcon />}
    </Wrapper>
  </AnimatePresence>
);


export default IssueIcon;
