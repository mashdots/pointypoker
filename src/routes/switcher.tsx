import { isV4Experience } from '@utils';

import LegacySwitcher from './legacySwitcher';
import Room from './room';
import Setup from './setup';

/**
 * This is a hybrid module that renders the v4 experience or the legacy
 * component that switches between user and room setup.
 */
const Switcher = () => {
  if (!isV4Experience()) {
    return <LegacySwitcher />;
  }

  if (window.location.pathname === '/') {
    return <Setup />;
  }

  return <Room />;
};

export default Switcher;
