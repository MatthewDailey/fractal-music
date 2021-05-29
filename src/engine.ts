import { CollisionDetector, NewPointAlgo, Point, RenderablePoint, RenderDataProvider } from "./models"

export class Engine<D, T extends RenderablePoint<D|undefined>> {
  private fractalPoints: Array<T> = []
  private animationLoopOn = false

  constructor(private newPointAlgo: NewPointAlgo,
              private renderablePointConstructor: (c: HTMLCanvasElement, p: Point) => T,
              private renderDataProvider: RenderDataProvider<D>,
              private canvas: HTMLCanvasElement) {}

  public addPoint(point: Point) {
    this.fractalPoints.push(this.renderablePointConstructor(this.canvas, point))
  }

  public generatePoint() {
    const point = this.newPointAlgo.generatePoint(
      this.fractalPoints.map(p => p.point))
    if (point) {
      this.fractalPoints.push(this.renderablePointConstructor(this.canvas, point))
      return true
    }
    return false
  }

  private renderAndUpdateAll() {
    window.requestAnimationFrame(() => this.fractalPoints.forEach((p, i) => {
      p.render(this.renderDataProvider.getData(p.point, i))
    }))
  }

  public startAnimationLoop = () => {
    if (!this.animationLoopOn) {
      this.animationLoopOn = true
      this.renderDataProvider.onStartAnimationLoop()

      const render = () => {
        this.renderAndUpdateAll()
        if (this.animationLoopOn) {
          window.requestAnimationFrame(render)
        } else {
          this.renderDataProvider.onStopAnimationLoop()
        }
      }
      window.requestAnimationFrame(render)
    }
  }

  public stopAnimationLoop = () => {
    this.animationLoopOn = false
  }

  public setPoints(points: Array<Point>) {
    this.fractalPoints = points.map(p => this.renderablePointConstructor(this.canvas, p))
  }

  public getPointsAsJson = () => JSON.stringify(this.fractalPoints.map(p => p.point))

  public setPointsFromJson = (pointsStr: string) => this.setPoints(JSON.parse(pointsStr))
}