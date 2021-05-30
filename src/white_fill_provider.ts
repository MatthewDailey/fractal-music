import { FillProvider, Point } from "./models"

export class WhiteFillProvider implements FillProvider {
  getFill(point: Point, index: number, length: number) {
    return "#FFF"
  }
}