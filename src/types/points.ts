export type Point = {
  id: string
  x: number
  y: number
  hex: string
}

export type Points = Record<Point["id"], Point>
