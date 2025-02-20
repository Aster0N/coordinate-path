import Button from "@/components/Button/Button"
import { PointsContext } from "@/components/PointsContext"
import { pointConsts } from "@/consts/consts"
import PointsService from "@/services/PointService/PointsService"
import SVGFieldService from "@/services/SVGFieldService/SVGFieldService"
import type { Point } from "@/types/points"
import { LockKeyhole, LockKeyholeOpen } from "lucide-react"
import { useContext, useEffect, useRef, useState } from "react"
import ColorDropdown from "../ColorDropdown/ColorDropDown"
import ContextMenu from "../ContextMenu/ContextMenu"
import styles from "./PathField.module.css"

const initialPointInfo: Point = {
  id: "",
  x: 0,
  y: 0,
  hex: pointConsts.defaultColor,
}

const PathField = () => {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [isContextMenuOpen, setIsContextMenuOpen] = useState<boolean>(false)
  const [contextMenuPointInfo, setContextMenuPointInfo] =
    useState<Point>(initialPointInfo)
  const [isEditable, setIsEditable] = useState<boolean>(false)
  const [lockSVGField, setLockSVGField] = useState<boolean>(false)
  const pointsContext = useContext(PointsContext)
  if (!pointsContext) {
    throw new Error("PointsContext must be used within a PointsContextProvider")
  }
  const { points, setPoints } = pointsContext?.pointsValue
  const svgControlsDisabled =
    isContextMenuOpen || !Object.keys(points).length || lockSVGField

  useEffect(() => {
    SVGFieldService.drawPoint(svgRef, points, isEditable)
    SVGFieldService.drawCurve(svgRef, points)

    if (isEditable) {
      SVGFieldService.dragPoint(svgRef, points, updateCoords)
    }
  }, [points, isEditable])

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
      [newPoint.id]: {
        id: newPoint.id,
        x: newPoint.x,
        y: newPoint.y,
        hex: newPoint.hex,
      },
    }))
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
    event.preventDefault()
    setIsEditable(false)
    const circleElement = event.target as SVGCircleElement
    const pointData = (circleElement as any).__data__
    setContextMenuPointInfo({
      id: pointData.id,
      x: event.clientX,
      y: event.clientY,
      hex: pointData.hex,
    })
    // ! executes faster than setContextMenuPointInfo
    setIsContextMenuOpen(true)
  }

  const deletePoint = () => {
    SVGFieldService.deletePoint(svgRef, contextMenuPointInfo.id)
    setPoints(prev => {
      const updatedPoints = { ...prev }
      delete updatedPoints[contextMenuPointInfo.id]
      return updatedPoints
    })
    SVGFieldService.drawCurve(svgRef, points)
    setIsContextMenuOpen(false)
  }

  const closeContextMenu = () => {
    setContextMenuPointInfo(initialPointInfo)
    setIsContextMenuOpen(false)
  }

  const handleSelectColorChange = (color: string) => {
    SVGFieldService.paintPoint(svgRef, color, contextMenuPointInfo.id)
    const updatedPoints = PointsService.updatePointColor(
      contextMenuPointInfo.id,
      color,
      points
    )
    setPoints(updatedPoints)
  }

  return (
    <div>
      {isContextMenuOpen && (
        <ContextMenu
          coords={{ x: contextMenuPointInfo.x, y: contextMenuPointInfo.y }}
          onClose={closeContextMenu}
        >
          <Button clickHandler={deletePoint}>delete</Button>
          <ColorDropdown
            selected={contextMenuPointInfo?.hex}
            options={pointConsts.selectColorOptions}
            onChange={handleSelectColorChange}
          ></ColorDropdown>
        </ContextMenu>
      )}
      <svg
        className={styles.field}
        ref={svgRef}
        onClick={addPoint}
        onContextMenu={event => openContextMenu(event)}
        style={{ pointerEvents: lockSVGField ? "none" : "all" }}
      />
      <div className={styles.actions}>
        <Button
          clickHandler={() => setIsEditable(!isEditable)}
          disabled={svgControlsDisabled}
        >
          {isEditable ? "save" : "edit position"}
        </Button>
        <Button
          className={lockSVGField ? styles.lockedFieldBtn : ""}
          clickHandler={() => setLockSVGField(!lockSVGField)}
        >
          <span>lock field</span>
          {lockSVGField ? (
            <LockKeyhole size={20} />
          ) : (
            <LockKeyholeOpen size={20} />
          )}
        </Button>
        <Button
          className={styles.clearBtn}
          clickHandler={clearField}
          disabled={svgControlsDisabled}
        >
          clear
        </Button>
      </div>
    </div>
  )
}

export default PathField
