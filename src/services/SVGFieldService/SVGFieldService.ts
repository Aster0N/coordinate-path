import { pointConsts } from "@/consts/consts"
import type {
  ClearField,
  DeletePoint,
  DragPoint,
  DrawCurve,
  DrawPoint,
  PaintPoint,
} from "@/services/SVGFieldService/types"
import type { Point } from "@/types/points"
import * as d3 from "d3"

const POINT_RADIUS = 20

export default class SVGFieldService {
  static drawPoint: DrawPoint = function (svgRef, points, isEditable) {
    if (!svgRef.current) return
    const svg = d3.select(svgRef.current)
    const pointsArray = Object.values(points)
    svg.selectAll("*").remove()

    svg
      .selectAll("circle")
      .data(pointsArray, (d: any) => d.uid)
      .enter()
      .append("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", POINT_RADIUS)
      .attr("fill", d => d.hex)
      .attr("cursor", isEditable ? "pointer" : "default")
      .attr("stroke", (_, i) => {
        if (i === 0) {
          return pointConsts.firstPointStroke
        }
        if (i === pointsArray.length - 1) {
          return pointConsts.lastPointStrike
        }
        return "none"
      })
      .attr("stroke-width", 4)
  }
  // ! can connect last with first, but can't connect first with last
  static dragPoint: DragPoint = function (svgRef, points, updateCoords) {
    if (!svgRef.current) return
    const svg = d3.select(svgRef.current)
    const circles = svg.selectAll<SVGCircleElement, Point>("circle")
    const pointsArray = Object.values(points)
    const firstPoint = {
      uid: pointsArray[0].uid,
      x: pointsArray[0].x,
      y: pointsArray[0].y,
    }
    let doConnect = false

    circles.call(
      d3
        .drag<SVGCircleElement, Point>()
        .on("start", function () {
          d3.select(this)
            .raise()
            .attr("stroke", pointConsts.pointOnDragStroke)
            .attr("stroke-width", 4)
        })
        .on("drag", function (event, d) {
          doConnect = false
          const svgRect = svgRef.current?.getBoundingClientRect()
          if (!svgRect) {
            return
          }
          d3.select(this).attr("stroke", pointConsts.pointOnDragStroke)
          d3.select(svgRef.current)
            .selectAll("circle")
            .filter((d: any) => d.uid === pointsArray[0].uid)
            .attr("stroke", pointConsts.firstPointStroke)

          const minX = 0
          const minY = 0
          const maxX = svgRect.width
          const maxY = svgRect.height
          d.x = Math.max(minX, Math.min(event.x, maxX))
          d.y = Math.max(minY, Math.min(event.y, maxY))

          const lastPoint = pointsArray[pointsArray.length - 1]
          const ifMakingACircle =
            d.uid === lastPoint.uid &&
            d.x >= firstPoint.x - POINT_RADIUS &&
            d.x <= firstPoint.x + POINT_RADIUS &&
            d.y >= firstPoint.y - POINT_RADIUS &&
            d.y <= firstPoint.y + POINT_RADIUS

          if (ifMakingACircle) {
            d3.select(this).attr("stroke", "orange")
            d3.select(svgRef.current)
              .selectAll("circle")
              .filter((d: any) => d.uid === pointsArray[0].uid)
              .attr("stroke", "orange")
            doConnect = true
          }

          d3.select(this).attr("cx", d.x).attr("cy", d.y)
          svg.selectAll("path").remove()
          SVGFieldService.drawCurve(svgRef, points)
        })
        .on("end", function (_, d) {
          if (doConnect) {
            d.x = firstPoint.x
            d.y = firstPoint.y
          }
          if (updateCoords) {
            updateCoords(d)
          }
        })
    )
  }

  static drawCurve: DrawCurve = function (svgRef, points) {
    if (!svgRef.current) return
    const svg = d3.select(svgRef.current)
    const pointsArray = Object.values(points)

    const lineGenerator = d3
      .line<Point>()
      .x(d => d.x)
      .y(d => d.y)
      .curve(d3.curveCatmullRom)

    const pathData = lineGenerator(pointsArray) || ""

    svg
      .append("path")
      .attr("d", pathData)
      .attr("fill", "none")
      .attr("pointer-events", "none")
      .attr("stroke", "white")
      .attr("stroke-width", 2)
  }

  static clearField: ClearField = function (svgRef) {
    if (!svgRef.current) return
    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()
  }

  static deletePoint: DeletePoint = function (svgRef, pointId) {
    if (!svgRef.current) return
    const svg = d3.select(svgRef.current)
    svg
      .selectAll("circle")
      .filter((d: any) => d.uid === pointId)
      .remove()
  }

  static paintPoint: PaintPoint = function (svgRef, color, pointId) {
    if (!svgRef.current) return

    d3.select(svgRef.current)
      .selectAll("circle")
      .filter((d: any) => d.uid === pointId)
      .attr("fill", color)
  }
}
