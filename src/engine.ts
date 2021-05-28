import { CollisionDetector, NewPointAlgo, Point, RenderablePoint } from "./models"

export class Engine<T extends RenderablePoint> {
  private fractalPoints: Array<T> = []

  constructor(private collisionDetector: CollisionDetector,
              private newPointAlgo: NewPointAlgo,
              private renderablePointConstructor: (c: HTMLCanvasElement, p: Point) => T,
              private canvas: HTMLCanvasElement) {}

  public addPoint(point: T) {
    this.fractalPoints.push(point)
  }

  public generatePoint() {
    const point = this.newPointAlgo.generatePoint(
      this.fractalPoints.map(p => p.point), this.collisionDetector)
    this.fractalPoints.push(this.renderablePointConstructor(this.canvas, point))
  }

  public renderAndUpdateAll() {
    this.fractalPoints.forEach(p => p.render(this.canvas))
  }
}