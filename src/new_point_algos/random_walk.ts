import { CollisionDetector, NewPointAlgo, Point } from "../models"

export class RandomWalk implements NewPointAlgo {
  constructor(private stepSize: number, private xMax: number, private yMax: number, private collisionDetector: CollisionDetector) {}

  private walkStart(): Point {
    return { x: Math.random() * this.xMax, y: Math.random() * this.yMax }
  }

  generatePoint(existingPoints: Array<Point>): Point {
    let currentPoint = this.walkStart()

    const isAnyCollision = () => existingPoints.some((p) => this.collisionDetector.isCollision(p, currentPoint))

    const takeStep = () => {
      const radianDirection = Math.random() * (2 * Math.PI)
      currentPoint.x = currentPoint.x + (Math.cos(radianDirection) * this.stepSize)
      currentPoint.y = currentPoint.y + (Math.sin(radianDirection) * this.stepSize)
    }

    while (!isAnyCollision()) {
      takeStep()

      // check bounds and if out of window create new start point
      if (currentPoint.x > this.xMax || currentPoint.x < 0 || currentPoint.y > this.yMax || currentPoint.y < 0) {
        currentPoint = this.walkStart()
      }
    }

    return currentPoint
  }
}
