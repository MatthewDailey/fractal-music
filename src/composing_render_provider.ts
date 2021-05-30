import { Point, RenderProvider } from "./models"


export class ComposingRenderProvider implements RenderProvider {
  private startTimeMs: number|null = null
  private currentProviderIndex: number = 0
  private incrementTimeout: any = null

  constructor(private providers: Array<RenderProvider>) {}

  render(point: Point, index: number, length: number) {
    if (this.currentProviderIndex >= this.providers.length) {
      return
    }
    if (!this.incrementTimeout) {
      setTimeout(() => {
        this.currentProviderIndex++
        this.incrementTimeout = null
      }, this.providers[this.currentProviderIndex].durationMs(length))
    }

    this.providers[this.currentProviderIndex].render(point, index, length)
  }

  durationMs(length: number): number {
    return this.providers.map(p => p.durationMs(length)).reduce((a, b) => a + b);
  }

  onStartAnimationLoop(): void {
    this.startTimeMs = Date.now()
  }

  onStopAnimationLoop(): void {
  }

  reset(): void {
    this.startTimeMs = null
  }
}