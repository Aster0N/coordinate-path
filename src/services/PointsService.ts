import { pointConsts } from "@/consts/consts"
import type { AddPoint, UpdatePointColor, UpdatePointCoords } from "./types"

export default class PointsService {
  static addPoint: AddPoint = function (svgRef, event, points) {
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect) {
      throw new Error("SVG reference is not available")
    }

    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const pointId = `${x}-${y}`
    const newPoint = { id: pointId, x, y, hex: pointConsts.defaultColor }

    if (points[pointId]) {
      return
    }

    return newPoint
  }

  static updateCoords: UpdatePointCoords = function ({ id, x, y }, points) {
    const newId = `${x}-${y}`
    const pointsArray = Object.entries(points)
    const index = pointsArray.findIndex(([key]) => key === id)
    if (index === -1) {
      return points
    }
    pointsArray[index] = [
      newId,
      {
        ...pointsArray[index][1],
        id: newId,
        x,
        y,
        hex: pointsArray[index][1].hex,
      },
    ]
    return Object.fromEntries(pointsArray)
  }

  static updatePointColor: UpdatePointColor = function (id, color, points) {
    const pointsArray = Object.entries(points)
    const index = pointsArray.findIndex(([key]) => key === id)
    if (index === -1) {
      return points
    }
    pointsArray[index][1].hex = color

    return Object.fromEntries(pointsArray)
  }
}
