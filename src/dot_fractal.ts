import { Point, RenderablePoint, RenderProvider } from "./models"


type Data = {
  shouldShow: false
} | {
  shouldShow: true
  scale: number
  fillStyle?: string
}

export class DotRenderablePoint extends RenderablePoint<Data> {
  constructor(canvas: HTMLCanvasElement, point: Point, private radius: number) {
    super(canvas, point);
  }

  render(data: Data) {
    if (data.shouldShow) {
      // clear the circle
      this.context.beginPath()
      this.context.arc(this.point.x, this.point.y, this.radius + 1, 0, 2 * Math.PI)
      this.context.fillStyle = '#FFF'
      this.context.fill()

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

export class DotRenderProvider implements RenderProvider<Data, DotRenderablePoint> {
  private startTimeMs: number|null = null
  private addTimes: { [k: number]: number } = {}

  constructor(private radius: number, private flashTimeStepMs: number = 1000, private addTimeStepMs: number = 1000) {}

  getPoint(c: HTMLCanvasElement, p: Point): DotRenderablePoint {
    return new DotRenderablePoint(c, p, this.radius);
  }

  getData(point: Point, index: number, length: number): Data {
    if (!this.startTimeMs) return { shouldShow: false }
    const now = Date.now()
    const dt =  now - this.startTimeMs

    const stepSinceStart = dt / this.addTimeStepMs

    if (stepSinceStart >= index) {
      if (!this.addTimes[index]) {
        this.addTimes[index] = now
      }
      const addDt = now - this.addTimes[index]
      const isFirstExpand = addDt < this.flashTimeStepMs

      return {
        shouldShow: true,
        scale: isFirstExpand ? ((addDt % (this.flashTimeStepMs)) / this.flashTimeStepMs) : 1,
        fillStyle: isFirstExpand ? "#000" : undefined
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
