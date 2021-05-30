import { Point, RenderablePoint, RenderProvider } from "./models"
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

export class ShrinkingDotRenderProvider implements RenderProvider {
  private startTimeMs: number|null = null
  private removeTimes: { [k: number]: number } = {}
  private stepsToSave: number = 0

  constructor(private canvas: HTMLCanvasElement,
              private radius: number,
              private flashTimeStepMs: number = 1000) {}

  reset() {
    this.startTimeMs = null
    this.removeTimes = {}
  }

  durationMs(numDots: number) {
    return this.flashTimeStepMs * numDots
  }

  private getPoint(c: HTMLCanvasElement, p: Point): GrowingDotRenderablePoint {
    return new GrowingDotRenderablePoint(c, p, this.radius);
  }

  public incrementStepsToSave = () => this.stepsToSave++

  private getData(point: Point, index: number, length: number): Data {
    if (!this.startTimeMs) return { shouldShow: false }

    const now = Date.now()
    const dt =  now - this.startTimeMs

    const stepSinceStart = dt / this.flashTimeStepMs

    if (stepSinceStart >= length - index - 1 && index >= this.stepsToSave) {
      if (!this.removeTimes[index]) {
        this.removeTimes[index] = now
      }
      const removeDt = now - this.removeTimes[index]
      const isWithinRemoveTime = removeDt < this.flashTimeStepMs

      if (isWithinRemoveTime) {
        return {
          shouldShow: true,
          scale: 1 - ((removeDt % (this.flashTimeStepMs)) / this.flashTimeStepMs),
        }
      } else {
        return {
          shouldShow: false
        }
      }
    }

    return { shouldShow: true, scale: 1 }
  }

  onStartAnimationLoop(): void {
    this.startTimeMs = Date.now()
  }

  onStopAnimationLoop(): void {
  }

  render(point: Point, index: number, length: number) {
    this.getPoint(this.canvas, point).render(this.getData(point, index, length))
  }
}

export function getShrinkingEngine(canvas: HTMLCanvasElement) {
  const radius = 10
  const renderProvider = new ShrinkingDotRenderProvider(canvas, radius, 100)
  const engine = new Engine(
    new RadialRandomWalk(radius, canvas.width, canvas.height, new RadialCollisionDetector()),
    renderProvider,
    canvas
  )
  engine.setOnNewPointFromClick(renderProvider.incrementStepsToSave)
  return engine
}