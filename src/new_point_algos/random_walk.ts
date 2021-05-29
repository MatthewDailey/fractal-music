import { CollisionDetector, NewPointAlgo, Point } from "../models"

export class RadialCollisionDetector implements CollisionDetector {
  isCollision(a: Point, b: Point, radius: number): Point|undefined {
    const dx = b.x - a.x
    const dy = b.y - a.y
    if (2*radius > Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))) {
      const theta = Math.atan2(dy, dx)
      const dist = 2*radius + 1
      return { x: a.x + (dist*Math.cos(theta)), y: a.y + (dist*Math.sin(theta)) }
    }
  }
}

const whileShortCircuit = <T>(whileTrue: () => boolean, block: () => T | undefined): T|undefined => {
  let attempts = 0
  let result: T|undefined = undefined
  while (!result && attempts < 100 && whileTrue()) {
    result = block()
    attempts++
  }
  return result
}

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

    // Make sure initial point has a good distance from any existing dots. This provides
    // coverage so once dots are tightly packed we can't start a walk in a place that is
    // too tightly packed to move to a fitting location.
    whileShortCircuit(
      () => !!isAnyCollision(currentPoint, this.radius * 2),
      () => currentPoint = this.randomPoint()
    )

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

    // Make sure no overlaps. Can overlap if initial point is in between other points.
    let newCollisionPoint = isAnyCollision(currentPoint, this.radius)
    whileShortCircuit(
      () => !!newCollisionPoint,
      () => {
        currentPoint = newCollisionPoint!
        console.log(currentPoint)
        newCollisionPoint = isAnyCollision(currentPoint, this.radius)
      }
    )

    if (isAnyCollision(currentPoint, this.radius)) {
      return undefined
    }
    return currentPoint
  }
}
