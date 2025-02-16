import type {
  ClearField,
  DeletePoint,
  DragPoint,
  DrawCurve,
  DrawPoint,
} from "@/services/types";
import type { Point } from "@/types/points";
import * as d3 from "d3";

export default class SVGFieldService {
  static drawPoint: DrawPoint = function (svgRef, points, isEditable) {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg
      .selectAll("circle")
      .data(Object.values(points), (d: any) => d.id)
      .enter()
      .append("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", 20)
      .attr("fill", "white")
      .attr("cursor", isEditable ? "pointer" : "default");
  };

  static dragPoint: DragPoint = function (svgRef, points, updateCoords) {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const circles = svg.selectAll<SVGCircleElement, Point>("circle");

    circles.call(
      d3
        .drag<SVGCircleElement, Point>()
        .on("start", function () {
          d3.select(this)
            .raise()
            .attr("stroke", "#747bff")
            .attr("stroke-width", 4);
        })
        .on("drag", function (event, d) {
          const svgRect = svgRef.current?.getBoundingClientRect();
          if (!svgRect) {
            return;
          }
          const minX = 0;
          const minY = 0;
          const maxX = svgRect.width;
          const maxY = svgRect.height;
          d.x = Math.max(minX, Math.min(event.x, maxX));
          d.y = Math.max(minY, Math.min(event.y, maxY));

          d3.select(this).attr("cx", d.x).attr("cy", d.y);
          svg.selectAll("path").remove();
          SVGFieldService.drawCurve(svgRef, points);
        })
        .on("end", function (_, d) {
          d3.select(this).attr("stroke", null);
          if (updateCoords) {
            updateCoords(d);
          }
        })
    );
  };

  static drawCurve: DrawCurve = function (svgRef, points) {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const pointsArray = Object.values(points);

    const lineGenerator = d3
      .line<Point>()
      .x(d => d.x)
      .y(d => d.y)
      .curve(d3.curveCatmullRom);

    const pathData = lineGenerator(pointsArray) || "";

    svg
      .append("path")
      .attr("d", pathData)
      .attr("fill", "none")
      .attr("pointer-events", "none")
      .attr("stroke", "white")
      .attr("stroke-width", 2);
  };

  static clearField: ClearField = function (svgRef) {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
  };

  static deletePoint: DeletePoint = function (svgRef, id) {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    console.log(id);

    svg
      .selectAll("circle")
      .filter((d: any) => d.id === id)
      .remove();
  };
}
