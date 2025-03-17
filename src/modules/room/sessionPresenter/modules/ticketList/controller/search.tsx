import React, { useCallback, useRef, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { div as AnimatedWrapper, button } from 'motion/react-client';
import styled, { css } from 'styled-components';

import SearchSvg from '@assets/icons/search.svg?react';
import { TextInput } from '@components/common';
import useTheme, { ThemedProps } from '@utils/styles/colors/colorSystem';
import { isOpenProps } from '@yappy/types/ui';

type Props = {
  onChange: (search: string) => void;
}

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-end;
`;

export const ButtonWrapper = styled(button)`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 0.5rem;
  border-width: 1px;
  border-style: solid;
  padding: 0;
`;

const SearchIcon = styled(SearchSvg)<isOpenProps>`
  ${({ isOpen, theme }: isOpenProps & ThemedProps) => css`
    > circle, line {
      stroke: ${theme.greyscale[ isOpen ? 'accent12' : 'accent10']};
      transition: all 500ms;
    }
  `}

  height: 1.5rem;
  width: 1.5rem;
`;

const Search = ({ onChange }: Props) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();

  const handleToggleInput = useCallback(() => {
    setIsSearchOpen(!isSearchOpen);

    if (!isSearchOpen) {
      onChange('');
    }
  }, [isSearchOpen, onChange]);

  return (
    <Wrapper>
      <AnimatePresence>
        {isSearchOpen ? (
          <AnimatedWrapper
            onAnimationStart={() => {
              if (searchRef?.current && isSearchOpen) {
                searchRef.current?.focus();
              }
            }}
            initial={{ opacity: 0, maxWidth: 0 }}
            animate={{ opacity: 1, maxWidth: '100%' }}
            exit={{ opacity: 0, maxWidth: 0 }}
            transition={{ type: 'tween', duration: 0.5 }}
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              width: '80%',
              overflow: 'hidden',
            }}
          >
            <TextInput id="ticket-search" value="" inputRef={searchRef} size='small' onChange={onChange} />
          </AnimatedWrapper>
        ) : null}
      </AnimatePresence>
      <ButtonWrapper
        transition={{ type: 'tween', duration: 0.3 }}
        style={{
          backgroundColor: theme[ isSearchOpen ? 'primary' : 'greyscale' ].accent5,
          borderColor: theme[ isSearchOpen ? 'primary' : 'greyscale' ].accent6,
        }}
        whileHover={{
          backgroundColor: theme.primary.accent6,
          borderColor: theme.primary.accent8,
          boxShadow: `0 0 0.25rem ${theme.greyscale.accent1}`,
        }}
        onClick={handleToggleInput}
      >
        <SearchIcon isOpen={isSearchOpen} />
      </ButtonWrapper>
    </Wrapper>
  );
};

export default Search;
