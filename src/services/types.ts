import type { Point, Points } from "@/types/points";

export type DrawPoint = (
  svgRef: React.RefObject<SVGSVGElement | null>,
  points: Points,
  isEditable: Boolean
) => void;

export type DrawCurve = (
  svgRef: React.RefObject<SVGSVGElement | null>,
  points: Points
) => void;

export type ClearField = (
  svgRef: React.RefObject<SVGSVGElement | null>
) => void;

export type DragPoint = (
  svgRef: React.RefObject<SVGSVGElement | null>,
  points: Points,
  updateCoords: (point: Point) => void
) => void;
