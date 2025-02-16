import Button from "@/components/Button/Button"
import { PointsContext } from "@/components/PointsContext"
import PointsService from "@/services/PointsService"
import SVGFieldService from "@/services/SVGFieldService"
import { Coords } from "@/services/types"
import type { Point } from "@/types/points"
import { useContext, useEffect, useRef, useState } from "react"
import ContextMenu from "../ContextMenu/ContextMenu"
import styles from "./PathField.module.css"

const PathField = () => {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [isContextMenuOpen, setIsContextMenuOpen] = useState<boolean>(false)
  const [contextMenuCoords, setContextMenuCoords] = useState<Coords>({
    x: 0,
    y: 0,
  })
  const [pointIdToDelete, setPointIdToDelete] = useState<Point["id"]>("")
  const [isEditable, setIsEditable] = useState<Boolean>(false)
  const pointsContext = useContext(PointsContext)
  if (!pointsContext) {
    throw new Error("PointsContext must be used within a PointsContextProvider")
  }
  const { points, setPoints } = pointsContext?.pointsValue

  const updateCoords = (point: Point) => {
    const updatedPoints = PointsService.updateCoords(point, points)
    setPoints(updatedPoints)
  }

  const addPoint = (event: React.MouseEvent<SVGSVGElement>) => {
    if (isContextMenuOpen) {
      setIsContextMenuOpen(false)
      return
    }
    const newPoint = PointsService.addPoint(svgRef, event, points)
    if (!newPoint) {
      return
    }
    setPoints(prev => ({
      ...prev,
      [newPoint.id]: { id: newPoint.id, x: newPoint.x, y: newPoint.y },
    }))
  }

  useEffect(() => {
    SVGFieldService.drawPoint(svgRef, points, isEditable)
    SVGFieldService.drawCurve(svgRef, points)

    if (isEditable) {
      SVGFieldService.dragPoint(svgRef, points, updateCoords)
    }
  }, [points, isEditable])

  const changeEditAbility = () => {
    setIsEditable(!isEditable)
  }

  const clearField = () => {
    SVGFieldService.clearField(svgRef)
    setPoints({})
    setIsEditable(false)
  }

  const openContextMenu = (event: React.MouseEvent) => {
    if (!(event.target instanceof SVGCircleElement)) {
      setIsContextMenuOpen(false)
      return
    }
    setIsEditable(false)
    event.preventDefault()
    setContextMenuCoords({
      x: event.clientX,
      y: event.clientY,
    })
    const circleElement = event.target as SVGCircleElement
    const pointData = (circleElement as any).__data__
    setPointIdToDelete(pointData.id)
    setIsContextMenuOpen(true)
  }

  const deletePoint = () => {
    SVGFieldService.deletePoint(svgRef, pointIdToDelete)
    setPoints(prev => {
      const updatedPoints = { ...prev }
      delete updatedPoints[pointIdToDelete]
      return updatedPoints
    })
    SVGFieldService.drawCurve(svgRef, points)
    setIsContextMenuOpen(false)
  }

  const closeContextMenu = () => {
    setPointIdToDelete("")
    setIsContextMenuOpen(false)
  }

  return (
    <div>
      {isContextMenuOpen && (
        <ContextMenu coords={contextMenuCoords} onClose={closeContextMenu}>
          <Button clickHandler={deletePoint}>delete</Button>
        </ContextMenu>
      )}
      <svg
        className={styles.field}
        ref={svgRef}
        onClick={addPoint}
        onContextMenu={event => openContextMenu(event)}
      />
      <div className={styles.actions}>
        <Button
          clickHandler={changeEditAbility}
          disabled={isContextMenuOpen || !Object.keys(points).length}
        >
          {isEditable ? "save" : "edit position"}
        </Button>
        <Button
          className={styles.clearBtn}
          clickHandler={clearField}
          disabled={isContextMenuOpen || !Object.keys(points).length}
        >
          clear
        </Button>
      </div>
    </div>
  )
}

export default PathField
