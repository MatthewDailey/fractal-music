import { CollisionDetector, NewPointAlgo, Point } from "../models"

export class RayWalk implements NewPointAlgo {
  constructor(private stepSize: number, private xMax: number, private yMax: number ) {}

  private walkStart(): Point {
    return { x: Math.random() * this.xMax, y: Math.random() * this.yMax }
  }

  generatePoint(existingPoints: Array<Point>): Point {
    while (true) {
      const currentPoint = this.walkStart()
      const radianDirection = Math.random() * (2 * Math.PI)

      for (let point of existingPoints) {

      }
    }
  }
}
