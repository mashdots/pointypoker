export type GridConfiguration = {
  columnStart: number;
  columnEnd: number;
  rowStart: number;
  rowEnd: number;
};

export type GridPanelProps = {
  gridConfig: GridConfiguration;
};
