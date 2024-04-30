import React, { useContext } from 'react';
import { useMediaQuery } from 'react-responsive';

type MobileProviderContext = {
  isMobile: boolean,
  isMobilePortrait: boolean,
  isTabletOrMobileDevice: boolean,
};

type ProviderProps = {
  children: JSX.Element,
}

const defaultContext = {
  isMobile: false,
  isMobilePortrait: false,
  isTabletOrMobileDevice: false,
};

const MobileContext = React.createContext<MobileProviderContext>(defaultContext);

const MobileProvider = ({ children }: ProviderProps): JSX.Element => {
  const isMobile = useMediaQuery({ maxWidth: 812 });
  const isMobilePortrait = useMediaQuery({ maxWidth: '812px', orientation: 'portrait' });
  const isTabletOrMobileDevice = useMediaQuery({ query: '(max-device-width: 75em)' });

  return (
    <MobileContext.Provider
      value={{
        isMobile,
        isMobilePortrait,
        isTabletOrMobileDevice,
      }}
    >
      {children}
    </MobileContext.Provider>
  );
};

const useMobile = (): MobileProviderContext => {
  const mobile = useContext(MobileContext);

  if (mobile === null) {
    throw new Error('useMobile() called outside of a MobileProvider');
  }

  return mobile;
};

export { MobileContext, MobileProvider, useMobile };
