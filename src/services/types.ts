import type { Point, Points } from "@/types/points"

export type Coords = {
  x: number
  y: number
}

export type DrawPoint = (
  svgRef: React.RefObject<SVGSVGElement | null>,
  points: Points,
  isEditable: Boolean
) => void

export type DrawCurve = (
  svgRef: React.RefObject<SVGSVGElement | null>,
  points: Points
) => void

export type ClearField = (svgRef: React.RefObject<SVGSVGElement | null>) => void

export type DragPoint = (
  svgRef: React.RefObject<SVGSVGElement | null>,
  points: Points,
  updateCoords: (point: Point) => void
) => void

export type DeletePoint = (
  svgRef: React.RefObject<SVGSVGElement | null>,
  pointId: Point["id"]
) => void

export type AddPoint = (
  svgRef: React.RefObject<SVGSVGElement | null>,
  event: React.MouseEvent<SVGSVGElement>,
  points: Points
) => Point | undefined

export type PaintPoint = (
  svgRef: React.RefObject<SVGSVGElement | null>,
  color: string,
  pointId: Point["id"]
) => void

export type UpdatePointCoords = ({ id, x, y }: Point, points: Points) => Points

export type UpdatePointColor = (
  id: string,
  color: string,
  points: Points
) => Points
