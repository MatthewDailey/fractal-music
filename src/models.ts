
export type Point = { x: number, y: number }

/**
 * Logic for how to render a point in the fractal on an html canvas.
 *
 * Generic D is the type of metadata that can be passed to a render call.
 */
export abstract class RenderablePoint<D> {
  protected context: CanvasRenderingContext2D

  constructor(private canvas: HTMLCanvasElement, public point: Point) {
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D
  }

  abstract render(data?: D)
}

/**
 * Algorithm for tuning when a point is touching another point so that during
 * a random walk to add a point we there is a collision and the point should stop there.
 */
export interface CollisionDetector {
  /**
   * @return Point of collision adjusted to be just touching and not overlapping. Undefined if no collision
   */
  isCollision(existing: Point, newPoint: Point, distance: number) : Point|undefined
}

/**
 * Algorithm for how a new point should be added into the fractal.
 *
 * For example, a basic case would be choosing a random point and random walking
 * until there is collision. Another might be walking along a ray.
 */
export interface NewPointAlgo {
  generatePoint(existingPoints: Array<Point>): Point|undefined
}

export interface Renderer {
  durationMs: (length: number) => number
  reset: () => void
  onStartAnimationLoop: () => void
  render(point: Point, index: number, length: number)
}