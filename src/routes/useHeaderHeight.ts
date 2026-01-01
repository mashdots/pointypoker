import { useOutletContext } from 'react-router-dom';

import { ContextType } from './root';

export default function useHeaderHeight() {
  return useOutletContext<ContextType>();
}
