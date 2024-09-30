import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';

import LinkSvg from '@assets/icons/link-out.svg?react';
import { ThemedProps } from '@utils/styles/colors/colorSystem';

type Props = {
  flex?: number;
  width?: string;
  content?: string | null;
  url?: string;
}

const LinkIcon = styled(LinkSvg)`
  height: 1rem;
  width: 1rem;
  margin-right: 0.25rem;
`;

const Wrapper = styled.div<Props>`
  ${({ theme }: Props & ThemedProps) => css`
    color: ${theme.primary.accent11};
  `}

  ${({ flex }: Props) => flex && css`
    flex: ${flex};
  `}

  ${({ width }: Props) => width && css`
    width: ${width};
  `}

  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0.5rem 0;
  height: 1rem;
  font-size: 1rem;
`;

const VisibilityControl = styled.div<{ isVisible: boolean }>`
  ${({ isVisible, theme }: { isVisible: boolean } & ThemedProps) => css`
      opacity: ${isVisible ? 1 : 0};
      filter: blur(${isVisible ? 0 : 0.25}rem);

      > a {
        color: ${theme.info.accent11};
      }
    `}

  > a {
    text-decoration: none;

    &:hover {
      text-decoration: underline;
      text-decoration-style: dashed;
      text-decoration-thickness: 1px;
    }
  }

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  transition: all 250ms;
`;

let timeoutOne: number;
let timeoutTwo: number;

const Subtitles = ({
  flex,
  width,
  content,
  url,
}: Props) => {
  const [ displayedContent, setDisplayedContent ] = useState<string | null>(null);
  const [ isVisible, setIsVisible ] = useState(false);

  /**
   * Over-engineered logic to make the icon animate in and out
  */
  useEffect(() => {
    if (content && content !== displayedContent) {
      clearTimeout(timeoutOne);
      setIsVisible(false);

      timeoutOne = setTimeout(() => {
        setDisplayedContent(content ?? '');
      }, 200);
    }

    timeoutTwo = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => {
      clearTimeout(timeoutOne);
      clearTimeout(timeoutTwo);
    };
  }, [ content ]);

  const finalContent = url ? (
    <a href={url} target="_blank" rel="noreferrer"><LinkIcon />{displayedContent}</a>
  ) : displayedContent;

  return (
    <Wrapper flex={flex} width={width}>
      <VisibilityControl isVisible={isVisible}>
        {finalContent}
      </VisibilityControl>
    </Wrapper>
  );
};

export default Subtitles;
