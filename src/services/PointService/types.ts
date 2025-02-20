import type { Point, Points } from "@/types/points"

export type AddPoint = (
  svgRef: React.RefObject<SVGSVGElement | null>,
  event: React.MouseEvent<SVGSVGElement>,
  points: Points
) => Point | undefined

export type UpdatePointCoords = ({ id, x, y }: Point, points: Points) => Points

export type UpdatePointColor = (
  id: string,
  color: string,
  points: Points
) => Points
