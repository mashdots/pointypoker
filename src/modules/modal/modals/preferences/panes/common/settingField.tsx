import React, { useMemo } from 'react';

import { TextInput } from '@components/common';
import { SettingFieldType, SettingFieldValue } from '@modules/modal/modals/preferences/panes/common/types';

type Props = {
  label: string;
  description?: string;
  type: SettingFieldType;
  delay?: number;
  preference: string;
  onChange: (pref?: string, newValue?: SettingFieldValue) => void;
  value: SettingFieldValue;
}

let timeout: number;

const SettingField = ({
  delay = 0,
  description,
  label,
  onChange,
  preference,
  type,
  value,
}: Props) => {

  const handleChange = (newValue: SettingFieldType) => {
    if (newValue === value) return; // No change, no need to update
    clearTimeout(timeout);

    if (delay > 0) {
      timeout = setTimeout(() => {
        console.log(`SettingField: ${ label } changed to`, newValue);
        onChange(preference, newValue);
      }, delay);
    } else {
      onChange(preference, newValue);
    }
  };

  const inputField = useMemo(() => {
    switch (type) {
    case 'text':
      return <TextInput size="small" id={`${label.toLowerCase()}-update`} value={value as string} onChange={handleChange} />;
    default:
      return null;
    }
  }, [type, value, handleChange]);

  return (
    <div>
      <label>{label}</label>
      {description && <p>{description}</p>}
      {inputField}
    </div>
  );
};

export default SettingField;
