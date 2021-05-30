import { Point, RenderProvider } from "./models"


export class ComposingRenderProvider implements RenderProvider {
  private startTimeMs: number|null = null

  constructor(private providers: Array<RenderProvider>) {}



  render(point: Point, index: number, length: number) {
  }

  durationMs(length: number): number {
    return 0;
  }

  onStartAnimationLoop(): void {
  }

  onStopAnimationLoop(): void {
  }

  reset(): void {
  }
}