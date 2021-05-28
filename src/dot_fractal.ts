import { CollisionDetector, NewPointAlgo, Point, RenderablePoint } from "./models"

export class DotRenderablePoint extends RenderablePoint {

  initialRender() {
    console.log(this.point)
  }

  updateRender() {
  }

}

export class DotCollisionDetector implements CollisionDetector {
  constructor(private radius: number) {}

  isCollision(a: Point, b: Point) {
    const dx = a.x - b.x
    const dy = a.y - b.y
    return 2*this.radius > Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
  }
}

export class RandomWalk implements NewPointAlgo {

  constructor(private stepSize: number, private xMax: number, private yMax: number ) {}

  private walkStart(): Point {
    return { x: Math.random() * this.xMax, y: Math.random() * this.yMax }
  }

  generatePoint(existingPoints: Array<Point>, collisionDetector: CollisionDetector): Point {
    let currentPoint = this.walkStart()

    const isAnyCollision = () => existingPoints.some((p) => collisionDetector.isCollision(p, currentPoint))

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

