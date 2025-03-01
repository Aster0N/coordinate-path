import type { Point } from "@/types/points"

export const defaultColor = "#FFFFFF"

export const pointConsts = {
  selectColorOptions: [
    {
      uniqueName: "White",
      colorHEX: defaultColor,
    },
    {
      uniqueName: "Vivid Blue",
      colorHEX: "#008CFF",
    },
    {
      uniqueName: "Bright Green",
      colorHEX: "#00D26A",
    },
    {
      uniqueName: "Hot Coral",
      colorHEX: "#FF4F58",
    },
    {
      uniqueName: "Electric Gray",
      colorHEX: "#A9A9A9",
    },
    {
      uniqueName: "Radiant Violet",
      colorHEX: "#B400FF",
    },
  ],
  firstPointStroke: "#4490dd",
  lastPointStrike: "#079a7d",
  pointOnDragStroke: "#747bff",
}

export const initialPointInfo: Point = {
  uid: "",
  x: 0,
  y: 0,
  hex: defaultColor,
}
