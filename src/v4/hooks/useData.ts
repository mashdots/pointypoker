import { useContext } from 'react';

import {
  Context as DataContext,
  type DataClient,
} from '@v4/providers/DataProvider';

const useData = (): DataClient => {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }

  return context;
};

export default useData;
