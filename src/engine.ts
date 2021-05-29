import { NewPointAlgo, Point, RenderablePoint, RenderProvider } from "./models"

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

  public run(nSteps: number) {
    for (let i = 0; i < nSteps; i++) {
      this.generatePoint()
      console.log("Added point...")
    }
    console.log(`Done adding ${nSteps} points`)
  }

  private onNewPointFromClick = (p: Point) => {}
  public setOnNewPointFromClick = (f: (p: Point) => void) => this.onNewPointFromClick = f

  public startCollectingPointsFromClicks = () => {
    this.canvas.onclick = (e) => {
      const newPoint = { x: e.clientX, y: e.clientY }
      console.log("Adding point from click", newPoint)
      this.addPoint(newPoint)
      this.onNewPointFromClick(newPoint)
    }
  }

  public stopCollectingPointsFromClicks = () => {
    this.canvas.onclick = () => {}
  }

  private renderAndUpdateAll() {
    window.requestAnimationFrame(() => this.fractalPoints.forEach((p, i) => {
      p.render(this.renderProvider.getData(p.point, i, this.fractalPoints.length))
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