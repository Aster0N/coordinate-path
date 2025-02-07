import SVGFieldService from "@/services/SVGFieldService";
import { useEffect, useRef, useState } from "react";
import Button from "../Button/Button";
import type { Point } from "./fieldTypes";
import cl from "./PathField.module.css";

const PathField = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [isEditable, setIsEditable] = useState<Boolean>(false);
  const nextId = useRef(0);

  useEffect(() => {
    SVGFieldService.drawPoint(svgRef, points, isEditable);
  }, [points, isEditable]);

  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setPoints((prev) => [...prev, { id: nextId.current++, x, y }]);
  };

  const changeEditAbility = () => {
    setIsEditable(!isEditable);
  };

  return (
    <div>
      <svg className={cl.field} ref={svgRef} onClick={handleClick} />
      <Button clickHandler={changeEditAbility}>
        {isEditable ? "save" : "edit position"}
      </Button>
    </div>
  );
};

export default PathField;
