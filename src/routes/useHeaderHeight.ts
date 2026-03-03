import { useOutletContext } from 'react-router';

import { ContextType } from './root';

export default function useHeaderHeight() {
  return useOutletContext<ContextType>();
}
