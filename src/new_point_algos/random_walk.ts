import { CollisionDetector, NewPointAlgo, Point } from "../models"

export class RandomWalk implements NewPointAlgo {
  constructor(private radius: number, private xMax: number, private yMax: number, private collisionDetector: CollisionDetector) {}

  private randomPoint(): Point {
    const positionWithRadiusBuffer = (max: number) =>
      (Math.random() * (max - 2*this.radius)) + this.radius
    return { x: positionWithRadiusBuffer(this.xMax), y: positionWithRadiusBuffer(this.yMax) }
  }

  generatePoint(existingPoints: Array<Point>): Point|undefined {
    let currentPoint = this.randomPoint()
    const isAnyCollision = (curr: Point, radius: number) => {
      for (let p of existingPoints) {
        const collisionPoint = this.collisionDetector.isCollision(p, curr, radius)
        if (collisionPoint) {
          return collisionPoint
        }
      }
    }

    console.log("generating point")
    // Make sure initial point has a good distance from any existing dots. This provides
    // coverage so once dots are tightly packed we can't start a walk in a place that is
    // too tightly packed to move to a fitting location.
    while (isAnyCollision(currentPoint, this.radius * 2)) {
      currentPoint = this.randomPoint()
    }
    console.log("got initial point", currentPoint)

    const takeStep = () => {
      const radianDirection = Math.random() * (2 * Math.PI)
      currentPoint.x = currentPoint.x + (Math.cos(radianDirection) * this.radius)
      currentPoint.y = currentPoint.y + (Math.sin(radianDirection) * this.radius)
    }

    // Find a point of collision
    let collisionPoint = isAnyCollision(currentPoint, this.radius)
    while (!collisionPoint) {
      takeStep()

      // check bounds and if out of window create new start point
      if (currentPoint.x > this.xMax || currentPoint.x < 0 || currentPoint.y > this.yMax || currentPoint.y < 0) {
        currentPoint = this.randomPoint()
      }

      collisionPoint = isAnyCollision(currentPoint, this.radius)
    }
    currentPoint = collisionPoint
    console.log("found collision")

    // Make sure no overlaps. Can overlap if initial point is in between other points.
    let attemptCnt = 0
    let newCollisionPoint = isAnyCollision(currentPoint, this.radius)
    while (newCollisionPoint) {
      currentPoint = newCollisionPoint
      console.log(currentPoint)
      newCollisionPoint = isAnyCollision(currentPoint, this.radius)

      attemptCnt++
      if (attemptCnt > 100) return undefined
    }
    console.log("found no overlaps")
    return currentPoint
  }
}
