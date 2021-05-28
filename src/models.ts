
export interface Point {
  location: { x: number, y: number }
  render(canvas: HTMLCanvasElement): undefined
}

export interface CollisionDetector<T extends Point> {
  isCollision(a: T, b: T)
}

export interface NewPointAlgo<T extends Point> {
  generatePoint(existingPoints: Array<Point>, collisionDetector: CollisionDetector<T>): T
}