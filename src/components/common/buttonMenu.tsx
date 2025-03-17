import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { AnimatePresence } from 'motion/react';
import { div as AnimatedWrapper, button } from 'motion/react-client';

import MoreSvg from '@assets/icons/more.svg?react';
import useTheme, { ThemedProps } from '@utils/styles/colors/colorSystem';
import DynamicMenu, { MenuItem } from '@components/common/dynamicMenu';

type Props = {
  shouldShow: boolean;
  isSimple?: boolean;
  menuItems: MenuItem[];
  size?: 'small' | 'medium' | 'large';
}

const MenuButtonIcon = styled(MoreSvg)`
  ${ ({ size, theme }: ThemedProps & { size: number }) => css`
    > circle {
      stroke: none;
      fill: ${ theme.greyscale.accent10 };
    }

    width: ${size}rem;
  `}

  transform: rotate(90deg);
`;

const MenuButton = styled(button)`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  border-width: 1px;
  border-style: solid;
  padding: 0;
`;

const ButtonMenu = ({ shouldShow, isSimple = false, menuItems, size = 'medium' }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setSetCoords] = useState({ x: 0, y: 0 });
  const { theme } = useTheme();

  const finalBgColor = isSimple ? 'transparent' : theme[ isOpen ? 'primary' : 'greyscale' ].accent5;
  const finalBorderColor = isSimple ? 'transparent' : theme[ isOpen ? 'primary' : 'greyscale' ].accent6;

  let iconRem = 1.5;
  let containerRem = 2.5;

  if (size === 'small') {
    iconRem = 1;
    containerRem = 2;
  } else if (size === 'large') {
    iconRem = 3;
    containerRem = 3.5;
  }

  const handleOpen = ({ clientY: y, clientX: x }: React.MouseEvent) => {
    setSetCoords({ x, y });
    setIsOpen(true);
  };

  return (
    <>
      <DynamicMenu
        handleClose={() => setIsOpen(false)}
        isOpen={isOpen}
        menuItems={menuItems}
        mouseLocation={coords}
      />
      <AnimatePresence>
        {shouldShow ? (
          <AnimatedWrapper
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{
              type: 'tween',
              duration: 0.2,
            }}
          >
            <MenuButton
              onClick={handleOpen}
              whileHover={{
                backgroundColor: isSimple ? 'transparent' : theme.primary.accent6,
                borderColor: isSimple ? 'transparent' : theme.primary.accent8,
                boxShadow: `0 0 0.25rem ${theme.greyscale.accent1}`,
                scale: 1.125,
              }}
              style={{
                backgroundColor: finalBgColor,
                borderColor: finalBorderColor,
                width: `${containerRem}rem`,
                height: `${containerRem}rem`,
              }}
            >
              <MenuButtonIcon size={iconRem} />
            </MenuButton>
          </AnimatedWrapper>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default ButtonMenu;
