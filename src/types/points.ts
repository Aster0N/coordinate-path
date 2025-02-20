export type Coords = {
  x: number
  y: number
}

export type Point = {
  id: string
  x: number
  y: number
  hex: string
}

export type Points = Record<Point["id"], Point>
