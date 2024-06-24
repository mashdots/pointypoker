import React, { useMemo } from 'react';
import styled, { css } from 'styled-components';

import { GridPanel } from '../../../components/common';
import { GridPanelProps } from '../../../components/common/gridPanel';
import { InfoCell } from '../components';
import { useTickets } from '../hooks';
import { calculateAverage, calculateSuggestedPoints } from '../utils';
import { ThemedProps } from '../../../utils/styles/colors/colorSystem';
import SuggestSvg from '../../../assets/icons/bulb.svg?react';
import AverageSvg from '../../../assets/icons/chart.svg?react';

type IconProps = {
  $shouldGrow: boolean;
}

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 100%;
`;

const ResultCell = styled.div<{ showBorder?: boolean } & ThemedProps>`
  ${({ showBorder, theme }) => {
    if (showBorder) {
      return css`
        border-right: 1px solid ${theme.greyscale.borderElement};
        padding-right: 1rem;
      `;
    } else {
      return css`
        padding-left: 1rem;
      `;
    }
  }}

  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0;
`;


const SuggestIcon = styled(SuggestSvg)<IconProps>`
  ${({ $shouldGrow }) => css`
    width: ${$shouldGrow ? 2 : 1}rem;
    height: ${$shouldGrow ? 2 : 1}rem;
  `}

  transition: all 500ms ease-out;
`;

const AverageIcon = styled(AverageSvg)<IconProps>`
  ${({ $shouldGrow }) => css`
    width: ${$shouldGrow ? 2 : 1}rem;
    height: ${$shouldGrow ? 2 : 1}rem;
  `}

  transition: all 500ms ease-out;
`;

const VoteResults = (props: GridPanelProps) => {
  const {
    currentTicket,
    shouldShowVotes,
  } = useTickets();

  const averagePointValue = useMemo(
    () => calculateAverage(currentTicket),
    [currentTicket],
  );

  const pointSuggestion = useMemo(
    () => calculateSuggestedPoints(currentTicket),
    [currentTicket],
  );

  return (
    <GridPanel config={props.gridConfig}>
      <Wrapper>
        <ResultCell showBorder>
          <InfoCell icon={<SuggestIcon $shouldGrow={!shouldShowVotes} />} value={shouldShowVotes ? pointSuggestion.suggestedPoints : null } label='suggested' />
        </ResultCell>
        <ResultCell>
          <InfoCell icon={<AverageIcon $shouldGrow={!shouldShowVotes} />} value={shouldShowVotes ? averagePointValue.average : null} label='average' />
        </ResultCell>
      </Wrapper>
    </GridPanel>
  );
};

export default VoteResults;
