import { Point, RenderablePoint, Renderer } from "./models"
import { Engine } from "./engine"
import { RadialCollisionDetector, RadialRandomWalk } from "./new_point_algos/random_walk"


type Data = {
  shouldShow: false
} | {
  shouldShow: true
  scale: number
  fillStyle?: string
}

export class GrowingDotRenderablePoint extends RenderablePoint<Data> {
  constructor(canvas: HTMLCanvasElement, point: Point, private radius: number) {
    super(canvas, point);
  }

  render(data: Data) {
    if (data.shouldShow) {
      // draw the expanding circle
      this.context.beginPath()
      this.context.arc(this.point.x, this.point.y, this.radius * data.scale, 0, 2 * Math.PI)
      this.context.stroke()
      if (data.fillStyle) {
        this.context.fillStyle = data.fillStyle
        this.context.fill()
      }
    }
  }

}

export class GrowingDotRenderer implements Renderer {
  private startTimeMs: number|null = null
  private addTimes: { [k: number]: number } = {}

  constructor(private canvas: HTMLCanvasElement,
              private radius: number,
              private growTimeMs: number = 1000,
              private addTimeMs: number = 1000) {}

  reset() {
    this.startTimeMs = null
    this.addTimes = {}
  }

  durationMs(numDots: number) {
    return numDots * this.growTimeMs
  }

  private getPoint(c: HTMLCanvasElement, p: Point): GrowingDotRenderablePoint {
    return new GrowingDotRenderablePoint(c, p, this.radius);
  }

  private getData(                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       point: Point, index: number, length: number): Data {
    if (!this.startTimeMs) return { shouldShow: false }
    const now = Date.now()
    const dt =  now - this.startTimeMs

    const stepSinceStart = dt / this.addTimeMs

    if (stepSinceStart >= index) {
      if (!this.addTimes[index]) {
        this.addTimes[index] = now
      }
      const addDt = now - this.addTimes[index]
      const isFirstExpand = addDt < this.growTimeMs

      return {
        shouldShow: true,
        scale: isFirstExpand ? ((addDt % (this.growTimeMs)) / this.growTimeMs) : 1,
        fillStyle: isFirstExpand ? "#000" : undefined
      }
    }

    return { shouldShow: false }
  }

  onStartAnimationLoop(): void {
    this.startTimeMs = Date.now()
  }

  render(point: Point, index: number, length: number) {
    this.getPoint(this.canvas, point).render(this.getData(point, index, length))
  }
}

export function getGrowingEngine(canvas: HTMLCanvasElement) {
  const radius = 2
  return new Engine(
    new RadialRandomWalk(radius, canvas.width, canvas.height, new RadialCollisionDetector()),
    new GrowingDotRenderer(canvas, radius, 500, 100),
    canvas
  )
}