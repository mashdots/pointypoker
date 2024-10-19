import { useMediaQuery } from 'react-responsive';

export type NarrowProps = {
  isNarrow: boolean;
}

const useMobile = (): NarrowProps => {
  const isNarrow = useMediaQuery({ maxWidth: 812 });

  return {
    isNarrow,
  };
};

export { useMobile };
