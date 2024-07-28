import React from 'react';
import styled, { css } from 'styled-components';

import { Control, CloseIcon, Label, SetupPrefWrapper, Description, SelectedOptionWrapper } from './commonComponents';
import FieldSvg from '@assets/icons/field.svg?react';
import OptionPicker from '@modules/preferences/panes/integrations/jira/optionPicker';
import useStore from '@utils/store';
import { useJira } from '@modules/integrations';
import { JiraField, JiraFieldPayload } from '@modules/integrations/jira';
import { ThemedProps } from '@utils/styles/colors/colorSystem';

const FieldIcon = styled(FieldSvg)`
  margin-right: 0.25rem;
  margin-left: 0rem;
  width: 1.5rem;
  
  ${ ({ theme }: ThemedProps) => css`
    > path {
      stroke: ${theme.primary.textLow};
    }

    > line {
      stroke: ${theme.primary.textHigh};
    }

    > line:first-child {
      stroke: ${theme.primary.textLow};
    }
  `}
`;

const PointFieldSection = () => {
  const { pointField, clearDefaultBoard, setDefaultBoard } = useStore(({ preferences, setPreferences }) => ({
    pointField: preferences?.jiraPreferences?.pointField,
    clearDefaultBoard: () => setPreferences('jiraPreferences', { ...preferences?.jiraPreferences, pointField: null }),
    setDefaultBoard: (field: JiraField) => setPreferences('jiraPreferences', { ...preferences?.jiraPreferences, pointField: field }),
  }));
  const { getIssueFields } = useJira();

  const transformer = (fields: JiraFieldPayload[]) => fields.map(
    ({ id, name, scope, schema }) => {
      const selectValue = { id, name };
      const shortDesc = scope?.type === 'PROJECT'
        ? `(${ schema?.type } for project ${ scope.project?.id })`
        : `(${ schema?.type })`;

      return {
        id,
        name,
        selectValue,
        shortDesc,
      };
    },
  );

  const picker = !pointField?.name
    ? (
      <OptionPicker
        idPrefix='point-field'
        placeholder='Find the field that represents points'
        fetchFn={getIssueFields}
        storeUpdateFn={setDefaultBoard}
        transformFn={transformer}
        filterFromNameStart
      />
    )
    : (
      <SelectedOptionWrapper>
        {pointField.name} <CloseIcon onClick={() => clearDefaultBoard()} />
      </SelectedOptionWrapper>
    );

  return (
    <SetupPrefWrapper>
      <Label>
        <FieldIcon /> Issue Point Field
      </Label>
      <Description>
        The field in Jira represents the points for an issue
      </Description>
      <Control>
        {picker}
      </Control>
    </SetupPrefWrapper>
  );
};

export default PointFieldSection;
