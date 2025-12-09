import { AnimatePresence } from 'motion/react';
import { div as Wrapper } from 'motion/react-client';
import React from 'react';

import styled, { css } from 'styled-components';

import { ThemedProps } from '@utils/styles/colors/colorSystem';

import { LinkIcon } from './components';

type Props = {
  flex?: number;
  width?: string;
  content?: string | null;
  url?: string;
};

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
        initial={{
          filter: 'blur(0.25rem)',
          opacity: 0,
        }}
        animate={{
          filter: 'blur(0rem)',
          opacity: 1,
        }}
        exit={{
          filter: 'blur(0.25rem)',
          opacity: 0,
        }}
        transition={{ duration: 0.25 }}
        style={{
          display: 'flex',
          flex,
          flexDirection: 'column',
          overflow: 'hidden',
          padding: '0 1rem',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          width,
        }}
      >
        {url ? (
          <StyledLink href={url} target="_blank"
            rel="noreferrer"><LinkIcon />{content ?? ''}</StyledLink>
        ) : content}
      </Wrapper>
    </AnimatePresence>
  );
};

export default Subtitles;
