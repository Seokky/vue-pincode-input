export type CellInputType = 'tel' | 'password';

export type Cell = {
  key: number,
  value: string,
};

export type CellsInputTypes = {
  [cellIdx: number]: CellInputType;
}

export type State = {
  baseRefName: string,
  focusedCellIdx: number,
  cells: Cell[],
  watchers: Record<string, Function>,
  cellsInputTypes: CellsInputTypes
}
