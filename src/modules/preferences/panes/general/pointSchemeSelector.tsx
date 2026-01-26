import { JSX } from 'react';

import { RadioGroup } from 'radix-ui';

import { VerticalContainer } from '@modules/preferences/panes/common';
import { getPointOptions, PointingSchemes } from '@modules/room/utils';
import useStore from '@utils/store';
import useTheme from '@utils/styles/colors';
import { PointScheme } from '@yappy/types/estimation';


const PointSchemaSelector = (): JSX.Element => {
  const {
    pointScheme,
    setPointScheme,
  } = useStore(({ preferences, setPreference }) => ({
    pointScheme: preferences.pointScheme ?? { scheme: PointingSchemes.fibonacci },
    setPointScheme: (newScheme: PointScheme) => setPreference('pointScheme', newScheme),
  }));

  const { theme } = useTheme();

  // T-shirt sizing is not supported right now.
  const options = [
    {
      label: PointingSchemes.fibonacci,
      pointOptions: getPointOptions(PointingSchemes.fibonacci, { max: 8 }),
    },
    {
      label: PointingSchemes.sequential,
      pointOptions: getPointOptions(PointingSchemes.sequential, { max: 6 }),
    },
  ];

  const updatePointScheme = (schemeData: Partial<PointScheme>) => {
    setPointScheme({
      ...pointScheme,
      ...schemeData,
    });
  };

  return (
    <VerticalContainer>
      <label htmlFor="pointing-options"><h3>Pointing Options</h3></label>
      <RadioGroup.Root
        id="pointing-options"
        value={pointScheme?.scheme}
        onValueChange={(value) => {
          updatePointScheme({ scheme: value as PointingSchemes });
        }}
      >
        {options.map(({ label, pointOptions }) => (
          <RadioGroup.Item
            key={label}
            value={label}
            style={{
              backgroundColor: label === pointScheme?.scheme ? theme.primary.accent4 : theme.transparent.accent5,
              border: `1px solid ${theme.primary.accent6}`,
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '0.5rem',
              marginRight: '1rem',
              marginTop: '0.5rem',
              padding: '0.5rem 1rem',
              userSelect: 'none',
            }}
          >
            {label} ({ pointOptions.sequence.join(', ') })
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
    </VerticalContainer>
  );
};

export default PointSchemaSelector;
