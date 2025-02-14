import Button from "@/components/Button/Button";
import { PointsContext } from "@/components/PointsContext";
import SVGFieldService from "@/services/SVGFieldService";
import type { Point } from "@/types/points";
import { useContext, useEffect, useRef, useState } from "react";
import cl from "./PathField.module.css";

const PathField = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [isEditable, setIsEditable] = useState<Boolean>(false);
  const pointsContext = useContext(PointsContext);
  if (!pointsContext) {
    throw new Error(
      "PointsContext must be used within a PointsContextProvider"
    );
  }
  const { points, setPoints } = pointsContext?.pointsValue;

  const updateCoords = ({ id, x, y }: Point) => {
    setPoints((prev) => {
      const newId = `${x}-${y}`;
      const pointsArray = Object.entries(prev);
      const index = pointsArray.findIndex(([key]) => key === id);
      if (index === -1) {
        return prev;
      }
      pointsArray[index] = [
        newId,
        { ...pointsArray[index][1], id: newId, x, y },
      ];
      return Object.fromEntries(pointsArray);
    });
  };

  useEffect(() => {
    SVGFieldService.drawPoint(svgRef, points, isEditable);
    SVGFieldService.drawCurve(svgRef, points);

    if (isEditable) {
      SVGFieldService.dragPoint(svgRef, points, updateCoords);
    }
    console.log(points);
  }, [points, isEditable]);

  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const pointId = `${x}-${y}`;

    if (points[pointId]) {
      return;
    }

    setPoints((prev) => ({
      ...prev,
      [pointId]: { id: pointId, x, y },
    }));
  };

  const changeEditAbility = () => {
    setIsEditable(!isEditable);
  };

  const clearField = () => {
    SVGFieldService.clearField(svgRef);
    setPoints({});
    setIsEditable(false);
  };

  return (
    <div>
      <svg className={cl.field} ref={svgRef} onClick={handleClick} />
      <div className={cl.actions}>
        <Button clickHandler={changeEditAbility}>
          {isEditable ? "save" : "edit position"}
        </Button>
        <Button clickHandler={clearField}>clear</Button>
      </div>
    </div>
  );
};

export default PathField;
