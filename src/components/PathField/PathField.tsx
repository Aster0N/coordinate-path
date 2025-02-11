import SVGFieldService from "@/services/SVGFieldService";
import { useEffect, useRef, useState } from "react";
import Button from "../Button/Button";
import cl from "./PathField.module.css";
import type { Points } from "./types";

const PathField = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [points, setPoints] = useState<Points>({});
  const [isEditable, setIsEditable] = useState<Boolean>(false);

  useEffect(() => {
    SVGFieldService.drawPoint(svgRef, points, isEditable);
    SVGFieldService.drawCurve(svgRef, points);

		if(isEditable) {
			SVGFieldService.dragPoint(svgRef, points)
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
