import { CollisionDetector, NewPointAlgo, Point, RenderablePoint, RenderDataProvider } from "./models"
import { Engine } from "./engine"
import { NStepRunner } from "./n_step_runner"
import { RandomWalk } from "./new_point_algos/random_walk"

export class DotRenderablePoint extends RenderablePoint<{ pulse: boolean }|undefined> {

  constructor(canvas: HTMLCanvasElement, point: Point, private radius: number) {
    super(canvas, point);
  }

  initialRender() {
    this.context.beginPath()
    this.context.arc(this.point.x, this.point.y, this.radius, 0, 2*Math.PI)
    this.context.stroke()
  }

  updateRender(data) {
    if (data && data.pulse) {
      this.context.translate(this.radius, this.radius)
    }
  }
}

export class DotCollisionDetector implements CollisionDetector {
  constructor() {}

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

class DotDataProvider implements RenderDataProvider<any> {
  getData(point: Point, index: number): any | undefined {
    return undefined;
  }
}

export function dotFractal(canvas: HTMLCanvasElement) {
  const radius = 10

  const engine = new Engine(
    new RandomWalk(radius, canvas.width, canvas.height, new DotCollisionDetector()),
    (c, p) => new DotRenderablePoint(c, p, radius),
    new DotDataProvider(),
    canvas
  )

  const runner = new NStepRunner(engine, canvas)

  // @ts-ignore
  window.engine = engine
  // @ts-ignore
  window.runner = runner
}
