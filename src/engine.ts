import { CollisionDetector, NewPointAlgo, Point, RenderablePoint } from "./models"

export class Engine<D, T extends RenderablePoint<D>> {
  private fractalPoints: Array<T> = []

  constructor(private collisionDetector: CollisionDetector,
              private newPointAlgo: NewPointAlgo,
              private renderablePointConstructor: (c: HTMLCanvasElement, p: Point) => T,
              private canvas: HTMLCanvasElement) {}

  public addPoint(point: Point) {
    this.fractalPoints.push(this.renderablePointConstructor(this.canvas, point))
  }

  public generatePoint() {
    const point = this.newPointAlgo.generatePoint(
      this.fractalPoints.map(p => p.point), this.collisionDetector)
    this.fractalPoints.push(this.renderablePointConstructor(this.canvas, point))
  }

  public renderAndUpdateAll(data: D) {
    this.fractalPoints.forEach(p => p.render(data))
  }
}