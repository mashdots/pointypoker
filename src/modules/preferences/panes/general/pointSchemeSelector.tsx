import { JSX, useMemo } from 'react';

import { RadioGroup } from 'radix-ui';

import { VerticalContainer } from '@modules/preferences/panes/common';
import { getPointOptions, PointingSchemes } from '@modules/room/utils';
import useStore from '@utils/store';
import useTheme from '@utils/styles/colors';
import { PointScheme } from '@yappy/types/estimation';

type Option = Partial<Omit<PointScheme, 'scheme'>> & {
  label: keyof Omit<PointScheme, 'scheme'>;
  type: 'number' | 'checkbox';
  shouldShow: boolean;
};

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
      pointOptions: getPointOptions(PointingSchemes.sequential, { max: 5 }),
    },
  ];

  const updatePointScheme = (schemeData: Partial<PointScheme>) => {
    setPointScheme({
      ...pointScheme,
      ...schemeData,
    });
  };

  const prefOptions: Option[] = useMemo(() => ([
    {
      label: 'max',
      shouldShow: pointScheme?.scheme !== PointingSchemes.tshirt,
      type: 'number',
    },
    {
      label: 'includeHalfPoints',
      shouldShow: pointScheme?.scheme === PointingSchemes.sequential,
      type: 'checkbox',
    },
    {
      label: 'halfPointMax',
      shouldShow: pointScheme?.scheme === PointingSchemes.sequential && pointScheme?.includeHalfPoints === true,
      type: 'number',
    },
  ]), [pointScheme]);


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
      {prefOptions.filter(({ shouldShow }) => shouldShow).map(({ label, type }) => (
        <div key={label} style={{ marginTop: '1rem' }}>
          <label htmlFor={label}>
            {label.charAt(0).toUpperCase() + label.slice(1)}
          </label>
          {type === 'number' ? (
            <input
              id={label}
              type="number"
              value={pointScheme?.[label] as number ?? ''}
              onChange={(e) => {
                const value = e.target.value === '' ? undefined : Number(e.target.value);
                updatePointScheme({ [label]: value });
              }}
              style={{
                marginLeft: '0.5rem',
                width: '4rem',
              }}
            />
          ) : (
            <input
              id={label}
              type="checkbox"
              checked={pointScheme?.[label] as boolean ?? false}
              onChange={(e) => {
                updatePointScheme({ [label]: e.target.checked });
              }}
              style={{ marginLeft: '0.5rem' }}
            />
          )}
        </div>
      ))}
    </VerticalContainer>
  );
};

export default PointSchemaSelector;
