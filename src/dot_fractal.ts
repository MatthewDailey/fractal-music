import { Point, RenderablePoint, RenderProvider } from "./models"

export class DotRenderablePoint extends RenderablePoint<undefined> {
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

export class DotRenderProvider implements RenderProvider<undefined, DotRenderablePoint> {
  constructor(private radius: number) {}

  getPoint(c: HTMLCanvasElement, p: Point): DotRenderablePoint {
    return new DotRenderablePoint(c, p, this.radius);
  }

  getData(point: Point, index: number): any | undefined {
    return undefined;
  }

  onStartAnimationLoop(): void {
  }

  onStopAnimationLoop(): void {
  }
}
