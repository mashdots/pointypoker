import { useContext } from 'react';

import { AuthContext } from '.';

const useAuthorizedUser = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthorizedUser must be used within an AuthProvider');
  }

  return context;
};

export { useAuthorizedUser };
