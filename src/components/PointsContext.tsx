import type { Points } from "@/types/points";
import { createContext, Dispatch, SetStateAction, useState } from "react";

type PointsProviderProps = {
  children: React.ReactNode;
};

type PointsContextValues = {
  pointsValue: {
    points: Points;
    setPoints: Dispatch<SetStateAction<Points>>;
  };
};

const PointsContext = createContext<PointsContextValues | null>(null);

const PointsContextProvider: React.FC<PointsProviderProps> = ({ children }) => {
  const [points, setPoints] = useState<Points>({});

  const pointsValue = { points, setPoints };

  return (
    <PointsContext.Provider
      value={{
        pointsValue,
      }}
    >
      {children}
    </PointsContext.Provider>
  );
};

export { PointsContext, PointsContextProvider };
