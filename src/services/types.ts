import type { Points } from "@/components/PathField/types";

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
