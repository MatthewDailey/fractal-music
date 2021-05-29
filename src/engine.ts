import { CollisionDetector, NewPointAlgo, Point, RenderablePoint, RenderProvider } from "./models"

export class Engine<D, T extends RenderablePoint<D|undefined>> {
  private fractalPoints: Array<T> = []
  private animationLoopOn = false

  constructor(private newPointAlgo: NewPointAlgo,
              private renderProvider: RenderProvider<D, T>,
              private canvas: HTMLCanvasElement) {}

  public addPoint(point: Point) {
    this.fractalPoints.push(this.renderProvider.getPoint(this.canvas, point))
  }

  public generatePoint() {
    const point = this.newPointAlgo.generatePoint(
      this.fractalPoints.map(p => p.point))
    if (point) {
      this.fractalPoints.push(this.renderProvider.getPoint(this.canvas, point))
      return true
    }
    return false
  }

  private renderAndUpdateAll() {
    window.requestAnimationFrame(() => this.fractalPoints.forEach((p, i) => {
      p.render(this.renderProvider.getData(p.point, i))
    }))
  }

  public startAnimationLoop = () => {
    if (!this.animationLoopOn) {
      this.animationLoopOn = true
      this.renderProvider.onStartAnimationLoop()

      const render = () => {
        this.renderAndUpdateAll()
        if (this.animationLoopOn) {
          window.requestAnimationFrame(render)
        } else {
          this.renderProvider.onStopAnimationLoop()
        }
      }
      window.requestAnimationFrame(render)
    }
  }

  public stopAnimationLoop = () => {
    this.animationLoopOn = false
  }

  public setPoints(points: Array<Point>) {
    this.fractalPoints = points.map(p => this.renderProvider.getPoint(this.canvas, p))
  }

  public getPointsAsJson = () => JSON.stringify(this.fractalPoints.map(p => p.point))

  public setPointsFromJson = (pointsStr: string) => this.setPoints(JSON.parse(pointsStr))
}