import React, { useEffect, useMemo, useRef } from 'react';
import throttle from 'lodash/throttle';
import { AnimatePresence } from 'motion/react';
import { div as AnimatedWrapper } from 'motion/react-client';
import styled, { css } from 'styled-components';

import Card from '@components/common/card';

export type MenuItem = {
  icon: JSX.Element;
  label: string;
  onClick: () => void;
}

type Props = {
  handleClose: () => void;
  isOpen: boolean;
  mouseLocation: {
    x: number;
    y: number;
  };
  menuItems: MenuItem[];
}

const Item = styled.button`
  background-color: transparent;

  cursor: pointer;
  border-radius: 0.5rem;
  border: none;
  font-size: 1rem;
  padding: 0.5rem 0.75rem;

  display: flex;
  align-items: center;
  
  text-decoration: none;
  transition: all 150ms;
  width: 100%;

  :not(:hover) {
    svg > circle, line, path, polyline, polygon {
      stroke: ${ ({ theme }) => theme.primary.accent11 };
      transition: all 150ms;
    }
  }
  
  :hover {
    ${ ({ theme }) => css`
      background-color: ${ theme.primary.accent5 };

      > p {
        color: ${ theme.primary.accent12 };
      }
    `}
  }
`;

const ItemLabel = styled.p`
  ${ ({ theme }) => css`
    color: ${ theme.primary.accent11 };
  `}
  margin: 0;
  white-space: nowrap;
  transition: all 150ms;
`;

const DynamicMenu = ({ isOpen, menuItems, mouseLocation, handleClose }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  // Depending on the location of the mouse when the menu is opened,
  // we'll position the menu so it's not running off the page.
  const location = useMemo(() => {
    const pos: { bottom?: string, top?: number, right?: string } = {};
    const { x: mouseLeft, y: mouseTop } = mouseLocation;

    if (window.innerHeight - mouseTop < menuItems.length * 30) {
      pos.bottom = '1.5rem';
    } else {
      pos.top = 0;
    }

    if (window.innerWidth - mouseLeft < 200) {
      pos.right = '1rem';
    }

    return pos;
  }, [ mouseLocation, menuItems.length, window.innerHeight, window.innerWidth ]);

  // Close the menu if the mouse is too far outside of it.
  const moveTracker = throttle(
    ({ clientX, clientY }: MouseEvent) => {
      if (ref.current) {
        const offset = 32;
        const { top, right, bottom, left } = ref.current.getBoundingClientRect();

        if (
          clientY < top - offset ||
          clientY > bottom + offset ||
          clientX < left - offset ||
          clientX > right + offset
        ) {
          handleClose();
        }
      }
    }, 300,
  );

  const items = menuItems.map((item, index) => {
    const handleClick = () => {
      item.onClick();
      handleClose();
    };

    return (
      <Item aria-label={item.label} key={index} onClick={handleClick}>
        {item.icon}
        <ItemLabel>{item.label}</ItemLabel>
      </Item>
    );
  });

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousemove', moveTracker);
    } else {
      document.removeEventListener('mousemove', moveTracker);
    }

    return () => {
      document.removeEventListener('mousemove', moveTracker);
    };
  }, [ isOpen ]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <AnimatedWrapper
          initial={{ opacity: 0, scale: 0.85, filter: 'blur(8px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 0.85, filter: 'blur(8px)' }}
          ref={ref}
          transition={{
            type: 'tween',
            duration: 0.2,
          }}
          style={{
            display: 'flex',
            zIndex: 100,
            position: 'absolute',
            flexDirection: 'column',
            ...location,
          }}
        >
          <Card overrideWidth='100%'>
            {items}
          </Card>
        </AnimatedWrapper>
      ) : null}
    </AnimatePresence>
  );
};

export default DynamicMenu;
