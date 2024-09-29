import { useMediaQuery } from 'react-responsive';

type MobileProviderContext = {
  isNarrow: boolean,
};

const useMobile = (): MobileProviderContext => {
  const isNarrow = useMediaQuery({ maxWidth: 812 });

  return {
    isNarrow,
  };
};

export { useMobile };
