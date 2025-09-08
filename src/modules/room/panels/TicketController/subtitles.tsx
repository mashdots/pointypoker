import React from 'react';
import { AnimatePresence } from 'motion/react';
import { div as Wrapper } from 'motion/react-client';
import styled, { css } from 'styled-components';

import { LinkIcon } from './components';
import { ThemedProps } from '@utils/styles/colors/colorSystem';

type Props = {
  flex?: number;
  width?: string;
  content?: string | null;
  url?: string;
}

const StyledLink = styled.a`
  ${ ({ theme }: ThemedProps) => css`
    color: ${ theme.info.accent11 };
  `}

  text-decoration: none;

  &:hover {
    text-decoration: underline;
    text-decoration-style: dashed;
    text-decoration-thickness: 1px;
    }
`;

const Subtitles = ({
  flex,
  width,
  content,
  url,
}: Props) => {

  return (
    <AnimatePresence mode='wait'>
      <Wrapper
        key={content || 'default-content'}
        initial={{ opacity: 0, filter: 'blur(0.25rem)' }}
        animate={{ opacity: 1, filter: 'blur(0rem)' }}
        exit={{ opacity: 0, filter: 'blur(0.25rem)' }}
        transition={{ duration: 0.25 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '0 1rem',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          flex,
          width,
        }}
      >
        {url ? (
          <StyledLink href={url} target="_blank" rel="noreferrer"><LinkIcon />{content ?? ''}</StyledLink>
        ) : content}
      </Wrapper>
    </AnimatePresence>
  );
};

export default Subtitles;
