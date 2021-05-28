
export type Point = { x: number, y: number }

/**
 * Logic for how to render a point in the fractal on an html canvas.
 *
 * Generic D is the type of metadata that can be passed to a render call.
 */
export abstract class RenderablePoint<D> {
  private context: CanvasRenderingContext2D

  constructor(private canvas: HTMLCanvasElement, public point: Point) {}

  public render(data: D) {
    if (!this.context) {
      this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D
      this.initialRender(data)
    } else {
      this.updateRender(data)
    }
  }

  /**
   * Draw the initial fractal point on the canvas.
   */
  abstract initialRender(data: D)

  /**
   * Update the rendered point.
   */
  abstract updateRender(data: D)
}

/**
 * Algorithm for tuning when a point is touching another point so that during
 * a random walk to add a point we there is a collision and the point should stop there.
 */
export interface CollisionDetector {
  isCollision(a: Point, b: Point)
}

/**
 * Algorithm for how a new point should be added into the fractal.
 *
 * For example, a basic case would be choosing a random point and random walking
 * until there is collision. Another might be walking along a ray.
 */
export interface NewPointAlgo {
  generatePoint(existingPoints: Array<Point>, collisionDetector: CollisionDetector): Point
}