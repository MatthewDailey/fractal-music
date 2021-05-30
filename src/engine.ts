import { NewPointAlgo, Point, RenderablePoint, RenderProvider } from "./models"

export class Engine {
  private fractalPoints: Array<Point> = []
  private animationLoopOn = false

  constructor(private newPointAlgo: NewPointAlgo,
              private renderProvider: RenderProvider<any, any>,
              private canvas: HTMLCanvasElement) {}

  public addPoint(point: Point) {
    this.fractalPoints.push(point)
  }

  public generatePoint() {
    const point = this.newPointAlgo.generatePoint(this.fractalPoints)
    if (point) {
      this.fractalPoints.push(point)
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
      this.renderProvider.render(p, i, this.fractalPoints.length)
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
    this.fractalPoints = points
  }

  public getPointsAsJson = () => JSON.stringify(this.fractalPoints)

  public setPointsFromJson = (pointsStr: string) => this.setPoints(JSON.parse(pointsStr))
}