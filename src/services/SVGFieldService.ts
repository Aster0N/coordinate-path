import type { Point, Points } from "@/components/PathField/types";
import * as d3 from "d3";

type DrawPoint = (
  svgRef: React.RefObject<SVGSVGElement | null>,
  points: Points,
  isEditable: Boolean
) => void;

export default class SVGFieldService {
  static drawPoint: DrawPoint = function (svgRef, points, isEditable) {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    // clear before rerender (avoiding duplicates)
    svg.selectAll("*").remove();

    const circles = svg
      .selectAll("circle")
      .data(Object.values(points), (d: any) => d.id)
      .enter()
      .append("circle")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", 10)
      .attr("fill", "white")
      .attr("cursor", isEditable ? "pointer" : "default");

    if (isEditable) {
      circles.call(
        d3
          .drag<SVGCircleElement, Point>()
          .on("start", function () {
            d3.select(this).raise().attr("stroke", "#747bff");
          })
          .on("drag", function (event, d) {
            d.x = event.x;
            d.y = event.y;
            d3.select(this).attr("cx", d.x).attr("cy", d.y);
          })
          .on("end", function () {
            d3.select(this).attr("stroke", null);
          })
      );
    }
  };
}
