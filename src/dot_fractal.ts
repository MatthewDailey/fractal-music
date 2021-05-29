import { CollisionDetector, NewPointAlgo, Point, RenderablePoint } from "./models"
import { Engine } from "./engine"
import { NStepRunner } from "./n_step_runner"
import { RandomWalk } from "./new_point_algos/random_walk"
import { RayWalk } from "./new_point_algos/ray_walk"
import { ConsoleRunner } from "./console_runner"

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

  isCollision(a: Point, b: Point): Point|undefined {
    const dx = b.x - a.x
    const dy = b.y - a.y
    if (2*this.radius > Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))) {
      const theta = Math.atan2(dy, dx)
      const dist = 2*this.radius + 1
      return { x: a.x + (dist*Math.cos(theta)), y: a.y + (dist*Math.sin(theta)) }
    }
  }
}


export function dotFractal(canvas: HTMLCanvasElement) {
  const engine = new Engine(
    new RandomWalk(5, canvas.width, canvas.height, new DotCollisionDetector(5)),
    (c, p) => new DotRenderablePoint(c, p),
    canvas
  )

  engine.addPoint({x: 10, y: 10})

  const runner = new NStepRunner(engine)
  runner.run(30)
  // @ts-ignore
  window.enginer = engine
}
