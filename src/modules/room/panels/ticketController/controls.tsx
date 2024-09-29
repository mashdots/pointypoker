import React, { useCallback, useMemo, useState } from 'react';
import styled, { css } from 'styled-components';

import ArrowSvg from '@assets/icons/arrow-right.svg?react';
import ArrowEnhanceSvg from '@assets/icons/arrow-right-enhance.svg?react';
import CircleCheckSvg from '@assets/icons/circle-check.svg?react';
import PlusSvg from '@assets/icons/plus.svg?react';
import PlusEnahnceSvg from '@assets/icons/plus-enhance.svg?react';
import ReportSvg from '@assets/icons/megaphone.svg?react';
import MoreSvg from '@assets/icons/more.svg?react';
import PointSvg from '@assets/icons/pencil-circle.svg?react';
import SkipSvg from '@assets/icons/skip.svg?react';
import Spinner from '@assets/icons/loading-circle.svg?react';
import { useTickets } from '@modules/room/hooks';
import { ThemedProps } from '@utils/styles/colors/colorSystem';
import { useJira } from '@modules/integrations';
import { TICKET_ACTIONS } from '@modules/room/hooks/ticket';
import { scaleEntrance, spinAnimation } from '@components/common/animations';
import { calculateSuggestedPoints } from '@modules/room/utils';
import { RoomUpdateObject } from '@yappy/types';
import { updateRoom } from '@services/firebase';
import { wait } from '@utils';
import { MODAL_TYPES } from '@modules/modal';
import useStore from '@utils/store';
import { useMobile } from '@utils/hooks/mobile';

enum EXTRA_ACTIONS {
  EXPAND_BUTTONS = 'EXPAND_BUTTONS',
}

type Props = {
  triggerFocus: (id: string) => void,
  setSubtitle: (content: string) => void,
};

type ButtonProps = {
  actions: TICKET_ACTIONS[],
  component: JSX.Element,
  disabled?: boolean,
  shouldShow?: boolean,
};

type ActionButtonProps = {
  disabled: boolean,
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: fit-content;
`;

const DynamicButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  overflow: hidden;
  align-items: center;
  transition: all 250ms ease-out;
`;

const LoadingIcon = styled(Spinner)`
  height: 2rem;
  width: 2rem;
  animation: ${ spinAnimation } 1s linear infinite;
`;

const MoreIcon = styled(MoreSvg)<ThemedProps>`
  height: 2rem;
  width: 2rem;

  > circle {
    stroke: ${ ({ theme }: ThemedProps) => theme.greyscale.textLow };
  }
`;

const SuccessIcon = styled(CircleCheckSvg)<ThemedProps>`
  height: 2rem;
  width: 2rem;

  > polyline, line, path, circle {
    stroke: ${ ({ theme }: ThemedProps) => theme.success.textLow };
  }
`;

const SkipIcon = styled(SkipSvg)`
  width: 2rem;
  height: 2rem;
  transition: stroke 250ms ease-out;
  

  ${({ theme }: ThemedProps) => css`
    > polyline, path {
      stroke: ${theme.error.textLow};
    }

    > circle {
      stroke: ${theme.greyscale.textLow};
    }
  `};
`;

const NextIcon = styled(ArrowSvg)`
  width: 2rem;
  height: 2rem;
  transition: stroke 250ms ease-out;
  

  ${({ theme }: ThemedProps) => css`
    > polyline, line {
      stroke: ${ theme.success.textLow };
    }
  `};
`;

const PointIcon = styled(PointSvg)`
  width: 2rem;
  height: 2rem;
  transition: stroke 250ms ease-out;
  

  ${({ theme }: ThemedProps) => css`
    > circle {
      stroke: ${ theme.info.textLow };
    }
    > polyline, path, line {
      stroke: ${ theme.warning.textLow };
    }
  `};
`;

const PointNextIcon = styled(ArrowEnhanceSvg)`
  width: 2rem;
  height: 2rem;
  transition: all 250ms ease-out;

  ${({ theme }: ThemedProps) => css`
    > polyline, line {
      stroke: ${ theme.success.textLow };
    }
    
    > polyline:last-child {
      stroke: ${ theme.info.textLow };
    }
  `};
`;

const NewIcon = styled(PlusSvg)`
  width: 2rem;
  transition: stroke 250ms ease-out;
  
  ${({ theme }: ThemedProps) => css`
    > line {
      stroke: ${ theme.warning.textLow };
    }
  `};
`;

const PointNewIcon = styled(PlusEnahnceSvg)`
  width: 2rem;
  transition: stroke 250ms ease-out;
  
  ${({ theme }: ThemedProps) => css`
    > line {
      stroke: ${ theme.warning.textLow };
    }

    > polyline {
      stroke: ${ theme.info.textLow };
    }
  `};
`;

const ReportIcon = styled(ReportSvg)`
  width: 2rem;
  transition: stroke 250ms ease-out;
  
  ${({ theme }: ThemedProps) => css`
    > path {
      stroke: ${ theme.error.textLow };
    }
  `};
`;

const ButtonWrapper = styled.div`
  margin-left: 0.5rem;
  animation: ${ scaleEntrance } 300ms;
`;

const ActionButton = styled.button<ActionButtonProps>`
  ${({ disabled, theme }: { disabled: boolean } & ThemedProps) => css`
    cursor: ${ disabled ? 'not-allowed' : 'pointer' };
    background-color: transparent;

    :hover {
      background-color: ${ disabled ? 'transparent' : theme.greyscale.componentBgHover };
    }

    > svg {
      > polyline, line, path, circle, polyline:last-child {
        ${ disabled && css`
          stroke: ${ theme.greyscale.textLow };;
        `}
      }
    }
  `};

  display: flex;
  align-items: center;
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 50%;
  border: none;
  transition: background-color 350ms cubic-bezier(0.39, 0.575, 0.565, 1);
`;


const Controls = ({ triggerFocus, setSubtitle }: Props) => {
  const { currentTicket, queue, shouldShowVotes, handleGoToNextTicket } = useTickets();
  const { isConfigured, writePointValue } = useJira();
  const { isNarrow } = useMobile();
  const [loadingIndex, setLoadingIndex ] = useState<number | null>(null);
  const [successIndex, setSuccessIndex ] = useState<number | null>(null);
  const [showAllButtons, setShowAllButtons] = useState(false);
  const openModal = useStore(({ setCurrentModal }) => () => setCurrentModal(MODAL_TYPES.PII));

  const collapsedButtonCount = useMemo(
    () => isNarrow ? 2 : 3,
    [ isNarrow ],
  );

  const handleAction = useCallback(
    (actions: TICKET_ACTIONS[], index: number) => {
      const { suggestedPoints } = calculateSuggestedPoints(currentTicket);
      const updateObj: RoomUpdateObject = {};

      actions.forEach(async (action) => {
        switch (action) {
        case TICKET_ACTIONS.SKIP:
          handleGoToNextTicket();
          break;

        case TICKET_ACTIONS.NEW:
          triggerFocus(currentTicket?.id ?? 'ticket');
          break;

        case TICKET_ACTIONS.POINT:
          if (isConfigured && currentTicket?.url) {
            setLoadingIndex(index);
            await wait(500);
            try {
              await writePointValue(currentTicket?.id, suggestedPoints as number, currentTicket.estimationFieldId);
              updateObj['currentTicket.suggestedPoints'] = suggestedPoints;
              updateObj['currentTicket.wasPointed'] = true;
            } catch (error) {
              updateObj[ 'currentTicket.wasPointed' ] = false;
            }

            setLoadingIndex(null);
            setSuccessIndex(index);
            await wait(500);
            updateRoom(currentTicket?.id, updateObj);
            setSuccessIndex(null);
          }
          break;

        case TICKET_ACTIONS.NEXT:
          // Similar to skip, but is locked behind a condition that requires all votes to be cast
          handleGoToNextTicket();
          break;

        case TICKET_ACTIONS.REPORT_PII:
          // Open a modal to report PII
          openModal();
          break;

        default:
          break;
        }
      });
      setShowAllButtons(false);
    },
    [currentTicket, queue],
  );

  const buildCaption = useCallback(
    (actions: Array<TICKET_ACTIONS | EXTRA_ACTIONS>) => {
      let message = '';

      if (
        !shouldShowVotes
        && (
          actions.includes(TICKET_ACTIONS.POINT)
          || actions.includes(TICKET_ACTIONS.NEXT)
        )
      ) {
        message += 'everyone should vote before you can ';
      }

      if (actions.includes(EXTRA_ACTIONS.EXPAND_BUTTONS)) {
        return 'see more options';
      }

      message += actions.map((action) => {
        switch (action) {
        case TICKET_ACTIONS.SKIP:
          return 'skip this';
        case TICKET_ACTIONS.NEW:
          return 'create a new';
        case TICKET_ACTIONS.POINT:
          return 'point this';
        case TICKET_ACTIONS.NEXT:
          return 'start the next';
        case TICKET_ACTIONS.REPORT_PII:
          return 'report PII for this';
        default:
          return '';
        }
      }).join(' and ');

      return message + ' ticket';
    },
    [shouldShowVotes],
  );

  const buttonOptions: Array<ButtonProps> = [
    {
      component: <ReportIcon />,
      shouldShow: isConfigured && currentTicket?.url,
      actions: [TICKET_ACTIONS.REPORT_PII],
    },
    {
      component: <SkipIcon />,
      shouldShow: queue.length > 0 && !!currentTicket,
      actions: [TICKET_ACTIONS.SKIP],
    },
    {
      component: <NewIcon />,
      shouldShow: !!currentTicket,
      actions: [TICKET_ACTIONS.NEW],
    },
    {
      component: <NextIcon />,
      shouldShow: queue.length > 0,
      actions: [ TICKET_ACTIONS.NEXT ],
      disabled: !shouldShowVotes,
    },
    {
      component: <PointIcon />,
      shouldShow: !queue.length && !!currentTicket && isConfigured && currentTicket?.url,
      actions: [TICKET_ACTIONS.POINT],
      disabled: !shouldShowVotes,
    },
    {
      component: <PointNewIcon />,
      shouldShow: !!currentTicket && isConfigured && currentTicket?.url,
      actions: [TICKET_ACTIONS.POINT, TICKET_ACTIONS.NEW],
      disabled: !shouldShowVotes,
    },
    {
      component: <PointNextIcon />,
      shouldShow: queue.length > 0 && isConfigured && currentTicket?.url,
      actions: [TICKET_ACTIONS.POINT, TICKET_ACTIONS.NEXT],
      disabled: !shouldShowVotes,
    },
  ];

  const buttonComponents = useMemo(
    () => buttonOptions
      .filter(bo => bo.shouldShow)
      .map(({ component, disabled, actions }: ButtonProps, index: number) => {
        const caption = buildCaption(actions);
        let icon = component;

        if (loadingIndex === index) {
          icon = <LoadingIcon />;
        } else if (successIndex === index) {
          icon = <SuccessIcon />;
        }

        return (
          <ButtonWrapper
            key={index}
            onMouseEnter={() => setSubtitle(caption)}
          >
            <ActionButton
              disabled={!!disabled && !loadingIndex}
              onClick={() => handleAction(actions, index)}
            >
              {icon}
            </ActionButton>
          </ButtonWrapper>
        );
      }),
    [ buttonOptions, loadingIndex, successIndex, currentTicket, queue ],
  );

  const dynamicWidth = useMemo(
    () => {
      if (buttonComponents.length > collapsedButtonCount && !showAllButtons) {
        return 3 * collapsedButtonCount;
      }

      return buttonOptions.filter(b => b.shouldShow).length * 3;
    },
    [buttonComponents, collapsedButtonCount],
  );

  const moreButton = useMemo(
    () => {
      if (buttonComponents.length > collapsedButtonCount && !showAllButtons) {
        return (
          <ButtonWrapper
            onMouseEnter={() => setSubtitle(buildCaption([ EXTRA_ACTIONS.EXPAND_BUTTONS ]))}
          >
            <ActionButton
              disabled={false}
              onClick={() => setShowAllButtons(true)}
            >
              <MoreIcon />
            </ActionButton>
          </ButtonWrapper>
        );
      }

      return null;
    },
    [ showAllButtons, buttonComponents, collapsedButtonCount ],
  );

  return (
    <Wrapper onMouseLeave={() => setSubtitle(' ')}>
      {moreButton}
      <DynamicButtonContainer style={{ width: `${dynamicWidth}rem` }}>
        {buttonComponents}
      </DynamicButtonContainer>
    </Wrapper>
  );
};

export default Controls;
