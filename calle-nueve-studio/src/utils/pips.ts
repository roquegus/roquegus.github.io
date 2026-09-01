import type { PipPosition } from "../types";

export function getPipPositions(value: number): PipPosition[] {
  switch (value) {
    case 0:
      return [];
    case 1:
      return [{ x: 0.5, y: 0.5 }];
    case 2:
      return [
        { x: 0.33, y: 0.33 },
        { x: 0.67, y: 0.67 },
      ];
    case 3:
      return [
        { x: 0.33, y: 0.25 },
        { x: 0.5, y: 0.5 },
        { x: 0.67, y: 0.75 },
      ];
    case 4:
      return [
        { x: 0.33, y: 0.25 },
        { x: 0.67, y: 0.25 },
        { x: 0.33, y: 0.75 },
        { x: 0.67, y: 0.75 },
      ];
    case 5:
      return [
        { x: 0.33, y: 0.25 },
        { x: 0.67, y: 0.25 },
        { x: 0.5, y: 0.5 },
        { x: 0.33, y: 0.75 },
        { x: 0.67, y: 0.75 },
      ];
    case 6:
      return [
        { x: 0.33, y: 0.2 },
        { x: 0.67, y: 0.2 },
        { x: 0.33, y: 0.5 },
        { x: 0.67, y: 0.5 },
        { x: 0.33, y: 0.8 },
        { x: 0.67, y: 0.8 },
      ];
    case 7:
      return [
        { x: 0.3, y: 0.18 },
        { x: 0.7, y: 0.18 },
        { x: 0.25, y: 0.5 },
        { x: 0.5, y: 0.5 },
        { x: 0.75, y: 0.5 },
        { x: 0.3, y: 0.82 },
        { x: 0.7, y: 0.82 },
      ];
    case 8:
      return [
        { x: 0.3, y: 0.18 },
        { x: 0.7, y: 0.18 },
        { x: 0.3, y: 0.38 },
        { x: 0.7, y: 0.38 },
        { x: 0.3, y: 0.62 },
        { x: 0.7, y: 0.62 },
        { x: 0.3, y: 0.82 },
        { x: 0.7, y: 0.82 },
      ];
    case 9:
      return [
        { x: 0.3, y: 0.18 },
        { x: 0.7, y: 0.18 },
        { x: 0.3, y: 0.38 },
        { x: 0.7, y: 0.38 },
        { x: 0.5, y: 0.5 },
        { x: 0.3, y: 0.62 },
        { x: 0.7, y: 0.62 },
        { x: 0.3, y: 0.82 },
        { x: 0.7, y: 0.82 },
      ];
    default:
      return [];
  }
}
