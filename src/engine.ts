import { CollisionDetector, NewPointAlgo, Point } from "./models"

export class Engine<T extends Point> {
  private fractalPoints: Array<T> = []

  constructor(private collisionDetector: CollisionDetector<T>,
              private newPointAlgo: NewPointAlgo<T>) {}

  public addPoint(point: T) {
    this.fractalPoints.push(point)
  }

  public generatePoint() {
    this.fractalPoints.push(this.newPointAlgo.generatePoint(this.fractalPoints, this.collisionDetector))
  }

  public getFractalPoints() { return [...this.fractalPoints] }
}