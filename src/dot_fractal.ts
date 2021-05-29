import { Point, RenderablePoint, RenderProvider } from "./models"


type Data = {
  shouldShow: false
} | {
  shouldShow: true
  scale: number
}

export class DotRenderablePoint extends RenderablePoint<Data> {
  constructor(canvas: HTMLCanvasElement, point: Point, private radius: number) {
    super(canvas, point);
  }

  initialRender(data) {
    if (data.shouldShow) {
      this.drawCircle()
    }
  }

  private drawCircle(scale: number = 1) {
    this.context.beginPath()
    this.context.arc(this.point.x, this.point.y, this.radius * scale, 0, 2 * Math.PI)
    this.context.fill()
    this.context.stroke()
    this.context.save()
  }

  updateRender(data: Data) {
    if (data.shouldShow) {
      this.context.restore()
      this.drawCircle(data.scale)
    }
  }
}

export class DotRenderProvider implements RenderProvider<Data, DotRenderablePoint> {
  private startTimeMs: number|null = null

  constructor(private radius: number) {}

  getPoint(c: HTMLCanvasElement, p: Point): DotRenderablePoint {
    return new DotRenderablePoint(c, p, this.radius);
  }

  getData(point: Point, index: number): Data {
    if (!this.startTimeMs) return { shouldShow: false }

    const dt = Date.now() - this.startTimeMs
    const secSinceStart = dt / 1000
    if (secSinceStart >= index) {
      return { shouldShow: true, scale: ((dt % 1000) / 1000) }
    }

    return { shouldShow: false }
  }

  onStartAnimationLoop(): void {
    this.startTimeMs = Date.now()
  }

  onStopAnimationLoop(): void {
  }
}
