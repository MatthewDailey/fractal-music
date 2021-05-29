import { Point, RenderablePoint, RenderProvider } from "./models"


type Data = {
  shouldShow: false
} | {
  shouldShow: true
  scale: number
}

export class DotRenderablePoint extends RenderablePoint<Data> {
  private isFirstScale: boolean = true

  constructor(canvas: HTMLCanvasElement, point: Point, private radius: number) {
    super(canvas, point);
  }

  render(data: Data) {
    if (data.shouldShow) {
      this.drawCircle(data.scale)
    }
  }

  private drawCircle(scale: number = 1) {
    // clear the circle
    this.context.beginPath()
    this.context.arc(this.point.x, this.point.y, this.radius + 1, 0, 2 * Math.PI)
    this.context.fillStyle = '#FFF'
    this.context.fill()

    // draw the expanding circle
    this.context.beginPath()
    this.context.arc(this.point.x, this.point.y, this.radius * scale, 0, 2 * Math.PI)
    this.context.stroke()
    if (this.isFirstScale) {
      this.context.fillStyle = '#000'
      this.context.fill()

      if (scale > 0.95) {
        this.isFirstScale = false
      }
    }
  }
}

export class DotRenderProvider implements RenderProvider<Data, DotRenderablePoint> {
  private startTimeMs: number|null = null

  constructor(private radius: number, private flashTimeStepMs: number = 1000, private addTimeStepMs: number = 1000) {}

  getPoint(c: HTMLCanvasElement, p: Point): DotRenderablePoint {
    return new DotRenderablePoint(c, p, this.radius);
  }

  getData(point: Point, index: number): Data {
    if (!this.startTimeMs) return { shouldShow: false }

    const dt = Date.now() - this.startTimeMs
    const stepSinceStart = dt / this.addTimeStepMs
    if (stepSinceStart >= index) {
      if (dt % this.flashTimeStepMs < this.flashTimeStepMs / 2) { // increasing
        return { shouldShow: true, scale: ((dt % (this.flashTimeStepMs/2)) / (this.flashTimeStepMs/2)) }
      } else { // decreasing
        return { shouldShow: true, scale: 1 - ((dt % (this.flashTimeStepMs/2)) / (this.flashTimeStepMs/2)) }
      }
    }

    return { shouldShow: false }
  }

  onStartAnimationLoop(): void {
    this.startTimeMs = Date.now()
  }

  onStopAnimationLoop(): void {
  }
}
