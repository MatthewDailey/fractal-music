import { Point, Renderer } from "./models"


export class ComposingRenderProvider implements Renderer {
  private startTimeMs: number|null = null
  private currentProviderIndex: number = 0
  private incrementTimeout: any = null

  constructor(private providers: Array<Renderer>) {}

  render(point: Point, index: number, length: number) {
    if (this.currentProviderIndex >= this.providers.length) {
      return
    }

    if (!this.incrementTimeout) {
      const duration = this.providers[this.currentProviderIndex].durationMs(length)
      this.incrementTimeout = setTimeout(() => {
        this.incrementTimeout = null
        this.currentProviderIndex++

        if (this.currentProviderIndex < this.providers.length) {
          this.providers[this.currentProviderIndex].onStartAnimationLoop()
        }
      }, duration)
    }

    this.providers[this.currentProviderIndex].render(point, index, length)
  }

  durationMs(length: number): number {
    return this.providers.map(p => p.durationMs(length)).reduce((a, b) => a + b);
  }

  onStartAnimationLoop(): void {
    this.startTimeMs = Date.now()
    this.providers[this.currentProviderIndex].onStartAnimationLoop()
  }

  onStopAnimationLoop(): void {
  }

  reset(): void {
    this.startTimeMs = null
  }
}