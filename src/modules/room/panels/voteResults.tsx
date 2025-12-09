import React, { useMemo } from 'react';

import styled, { css } from 'styled-components';

import SuggestSvg from '@assets/icons/bulb.svg?react';
import AverageSvg from '@assets/icons/chart.svg?react';
import { GridPanel } from '@components/common';
import { GridPanelProps } from '@components/common/gridPanel';
import { ThemedProps } from '@utils/styles/colors/colorSystem';

import { InfoCell } from '../components';
import { useTickets } from '../hooks';
import { calculateAverage, calculateSuggestedPoints } from '../utils';

type IconProps = {
  $shouldGrow: boolean;
} & ThemedProps;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 100%;
`;

const ResultCell = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0 1rem;
`;

const VerticalDivider = styled.div`
  ${({ theme }: ThemedProps) => css`
    background-color: ${theme.primary.accent7};
  `}

  width: 1px;
  height: 50%;
`;

const SuggestIcon = styled(SuggestSvg)<IconProps>`
  ${({ $shouldGrow, theme }: IconProps) => css`
    width: ${$shouldGrow ? 2 : 1}rem;
    height: ${$shouldGrow ? 2 : 1}rem;

    > line, polyline, path {
      stroke: ${theme.primary.accent11};
    }
  `}

  transition: all 500ms ease-out;
`;

const AverageIcon = styled(AverageSvg)<IconProps>`
  ${({ $shouldGrow, theme }: IconProps) => css`
    width: ${$shouldGrow ? 2 : 1}rem;
    height: ${$shouldGrow ? 2 : 1}rem;

    > polyline {
      stroke: ${theme.primary.accent11};
    }
  `}

  transition: all 500ms ease-out;
`;

const VoteResults = ({ config }: GridPanelProps) => {
  const {
    currentTicket,
    shouldShowVotes,
  } = useTickets();

  const averagePointValue = useMemo(() => calculateAverage(currentTicket), [currentTicket]);

  const pointSuggestion = useMemo(() => calculateSuggestedPoints(currentTicket), [currentTicket]);

  return (
    <GridPanel config={config}>
      <Wrapper>
        <ResultCell>
          <InfoCell
            icon={<SuggestIcon $shouldGrow={!shouldShowVotes} />}
            value={shouldShowVotes ? pointSuggestion.suggestedPoints : null }
            label='suggested'
          />
        </ResultCell>
        <VerticalDivider />
        <ResultCell>
          <InfoCell
            icon={<AverageIcon $shouldGrow={!shouldShowVotes} />}
            value={shouldShowVotes ? averagePointValue.average : null}
            label='average'
          />
        </ResultCell>
      </Wrapper>
    </GridPanel>
  );
};

export default VoteResults;
