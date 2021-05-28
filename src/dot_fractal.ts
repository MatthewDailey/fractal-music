import { CollisionDetector, NewPointAlgo, Point, RenderablePoint } from "./models"
import { Engine } from "./engine"
import { NStepRunner } from "./n_step_runner"
import { RandomWalk } from "./new_point_algos/random_walk"
import { RayWalk } from "./new_point_algos/ray_walk"

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


export function dotFractal(canvas: HTMLCanvasElement) {
  const engine = new Engine(
    new RandomWalk(3, canvas.width, canvas.height, new DotCollisionDetector(10)),
    (c, p) => new DotRenderablePoint(c, p),
    canvas
  )

  engine.addPoint({x: 10, y: 10})

  const runner = new NStepRunner(engine)
  runner.run(100)
}
