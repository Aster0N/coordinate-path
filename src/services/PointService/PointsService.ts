import { pointConsts } from "@/consts/consts"
import type {
  AddPoint,
  GenerateUId,
  UpdatePointColor,
  UpdatePointCoords,
} from "@/services/PointService/types"

export default class PointsService {
  static generateUId: GenerateUId = function (coords) {
    const id = `${coords.x}-${coords.y}`
    const uid = `${crypto.randomUUID()}#${id}`
    return uid
  }

  static addPoint: AddPoint = function (svgRef, event, points) {
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect) {
      throw new Error("SVG reference is not available")
    }
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const pointId = PointsService.generateUId({ x, y })
    const newPoint = { uid: pointId, x, y, hex: pointConsts.defaultColor }

    if (points[pointId]) {
      return
    }
    return newPoint
  }

  static updateCoords: UpdatePointCoords = function ({ uid, x, y }, points) {
    const newId = `${uid}#${x}-${y}`
    const pointsArray = Object.entries(points)
    const index = pointsArray.findIndex(([key]) => key === uid)
    if (index === -1) {
      return points
    }
    pointsArray[index] = [
      newId,
      {
        ...pointsArray[index][1],
        uid: newId,
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
