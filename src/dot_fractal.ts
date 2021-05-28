import { CollisionDetector, NewPointAlgo, Point, RenderablePoint } from "./models"
import { Engine } from "./engine"
import { NStepRunner } from "./n_step_runner"

export class DotRenderablePoint extends RenderablePoint<undefined> {

  initialRender() {
    this.context.beginPath()
    this.context.arc(this.point.x, this.point.y, 5, 0, 2*Math.PI)
    this.context.stroke()
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

export function dotFractal(canvas: HTMLCanvasElement) {
  const stepSize = 10

  const engine = new Engine(
    new DotCollisionDetector(stepSize),
    new RandomWalk(stepSize, canvas.width, canvas.height),
    (c, p) => new DotRenderablePoint(c, p),
    canvas
  )

  engine.addPoint({x: 10, y: 10})

  const runner = new NStepRunner(engine)
  runner.run(1000)

}
