import { CollisionDetector, NewPointAlgo, Point } from "../models"

export class RandomWalk implements NewPointAlgo {
  constructor(private stepSize: number, private xMax: number, private yMax: number, private collisionDetector: CollisionDetector) {}

  private randomPoint(): Point {
    return { x: Math.random() * this.xMax, y: Math.random() * this.yMax }
  }

  generatePoint(existingPoints: Array<Point>): Point {
    let currentPoint = this.randomPoint()
    const isAnyCollision = (curr: Point) => {
      for (let p of existingPoints) {
        const collisionPoint = this.collisionDetector.isCollision(p, curr)
        if (collisionPoint) {
          return collisionPoint
        }
      }
    }

    // Make sure initial point isn't overlapping existing points.
    while (isAnyCollision(currentPoint)) {
      currentPoint = this.randomPoint()
    }

    const takeStep = () => {
      const radianDirection = Math.random() * (2 * Math.PI)
      currentPoint.x = currentPoint.x + (Math.cos(radianDirection) * this.stepSize)
      currentPoint.y = currentPoint.y + (Math.sin(radianDirection) * this.stepSize)
    }

    // Find a point of collision
    let collisionPoint = isAnyCollision(currentPoint)
    while (!collisionPoint) {
      takeStep()

      // check bounds and if out of window create new start point
      if (currentPoint.x > this.xMax || currentPoint.x < 0 || currentPoint.y > this.yMax || currentPoint.y < 0) {
        currentPoint = this.randomPoint()
      }

      collisionPoint = isAnyCollision(currentPoint)
    }
    currentPoint = collisionPoint

    // Make sure no overlaps
    let newCollisionPoint = isAnyCollision(currentPoint)
    while (newCollisionPoint) {
      currentPoint = newCollisionPoint
      newCollisionPoint = isAnyCollision(currentPoint)
    }

    return currentPoint
  }
}
