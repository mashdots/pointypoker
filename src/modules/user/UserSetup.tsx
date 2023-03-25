import React, { useState } from 'react';
import styled from 'styled-components';

import { getUserCookie, setUserCookie } from '../../utils';
import { VARIATIONS } from '../../utils/styles';
import NameInput from './NameInput';

const CookieNotice = styled.p`
  color: ${VARIATIONS.structure.textLowContrast};
`;

const UserSetup = () => {
  const [name, setName] = useState<string>('');
  getUserCookie();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(name);
    setUserCookie(name);
  };
  
  return (
    <>
      <h1>What do we call you?</h1>
      <CookieNotice>This is stored in a cookie so we won&apos;t ask you every time.</CookieNotice>
      <form onSubmit={handleSubmit} autoComplete='off'>
        <NameInput
          id='name'
          onChange={({ target }) => setName(target.value)}
          value={name}
        />
      </form>
    </>
  );
};

export default UserSetup;
