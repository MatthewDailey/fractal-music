import { Point, RenderProvider } from "./models"


export class ComposingRenderProvider<D, T> implements RenderProvider<D, T> {
  durationMs(length: number): number {
    return 0;
  }

  onStartAnimationLoop(): void {
  }

  onStopAnimationLoop(): void {
  }

  reset(): void {
  }

  getData(point: Point, index: number, length: number): D | undefined {
    return undefined;
  }

  getPoint(c: HTMLCanvasElement, p: Point): T {
    return undefined;
  }
}