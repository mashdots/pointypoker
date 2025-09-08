import React from 'react';
import styled, { css } from 'styled-components';
import { AnimatePresence } from 'motion/react';
import { div as Wrapper } from 'motion/react-client';

import ArticleSvg from '@assets/icons/article.svg?react';
import { ThemedProps } from '@utils/styles/colors/colorSystem';

type Props = {
  src?: string;
  ticketUrl?: string;
}

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

const IssueIcon = ({ src = '', ticketUrl }: Props) =>  (
  <AnimatePresence mode='wait'>
    <Wrapper
      key={src || 'default'}
      initial={{ opacity: 0, scale: 0.75, filter: 'blur(0.5rem)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0rem)' }}
      exit={{ opacity: 0, scale: 0.75, filter: 'blur(0.5rem)' }}
      transition={{ duration: 0.25 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '3rem',
        width: '3rem',
        margin: '0 0.5rem',
      }}
    >
      {src ? (
        <a href={ticketUrl} target='_blank' rel="noreferrer">
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
