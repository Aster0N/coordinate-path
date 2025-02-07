export type Point = {
  id: string;
  x: number;
  y: number;
};

export type Points = Record<Point["id"], Point>;
