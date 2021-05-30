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
      const duration = this.providers[this.currentProviderIndex].durationMs(length)
      console.log("setting timeout for ", duration)
      this.incrementTimeout = setTimeout(() => {
        this.incrementTimeout = null
        this.currentProviderIndex++

        if (this.currentProviderIndex < this.providers.length) {
          this.providers[this.currentProviderIndex].onStartAnimationLoop()
        }

        console.log("incremented provider!")
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