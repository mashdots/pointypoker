import { useMediaQuery } from 'react-responsive';

export type NarrowProps = {
  isBelowMaxWidth: boolean;
  isNarrow: boolean;
}

export type HorizontalPaddingProps = {
  noHorizontalPadding?: boolean;
}

const useMobile = (): NarrowProps => {
  const isBelowMaxWidth = useMediaQuery({ maxWidth: '80rem' });
  const isNarrow = useMediaQuery({ maxWidth: 812 });

  return {
    isBelowMaxWidth,
    isNarrow,
  };
};

export { useMobile };
