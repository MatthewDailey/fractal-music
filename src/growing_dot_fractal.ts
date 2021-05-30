import { FillProvider, Point, RenderablePoint, Renderer } from "./models"
import { Engine } from "./engine"
import { RadialCollisionDetector, RadialRandomWalk } from "./new_point_algos/random_walk"
import { WhiteFillProvider } from "./white_fill_provider"


type Data = {
  shouldShow: false
} | {
  shouldShow: true
  scale: number
  fillStyle: string
}

export class GrowingDotRenderablePoint extends RenderablePoint<Data> {
  constructor(canvas: HTMLCanvasElement, point: Point, private radius: number) {
    super(canvas, point);
  }

  render(data: Data) {
    if (data.shouldShow) {
      // clear underneath
      this.context.beginPath()
      this.context.arc(this.point.x, this.point.y, this.radius, 0, 2 * Math.PI)
      this.context.fillStyle = "#FFFFFF00"
      this.context.fill()

      // draw the expanding circle
      this.context.beginPath()
      this.context.arc(this.point.x, this.point.y, this.radius * data.scale, 0, 2 * Math.PI)
      this.context.stroke()
      this.context.fillStyle = data.fillStyle
      this.context.fill()
    }
  }

}

export class GrowingDotRenderer implements Renderer {
  private startTimeMs: number|null = null
  private addTimes: { [k: number]: number } = {}

  constructor(private canvas: HTMLCanvasElement,
              private radius: number,
              private fillProvider: FillProvider,
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
    const getDataMs = Date.now()
    const dt =  getDataMs - this.startTimeMs

    const stepSinceStart = dt / this.addTimeMs

    if (stepSinceStart >= index) {
      if (!this.addTimes[index]) {
        this.addTimes[index] = getDataMs
      }
      const addDt = getDataMs - this.addTimes[index]
      const isFirstExpand = addDt < this.growTimeMs

      if (isFirstExpand) {
        return {
          shouldShow: true,
          fillStyle: '#000',
          scale: (addDt % (this.growTimeMs)) / this.growTimeMs
        }
      } else {
        return {
          shouldShow: true,
          scale: 1,
          fillStyle: this.fillProvider.getFill(point, index, length)
        }
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
    new GrowingDotRenderer(canvas, radius, new WhiteFillProvider(), 500, 100),
    canvas
  )
}