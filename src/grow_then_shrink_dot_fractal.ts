import { ComposingRenderProvider } from "./composing_render_provider"
import { GrowingDotRenderProvider } from "./growing_dot_fractal"
import { ShrinkingDotRenderProvider } from "./shrinking_dot_fractal"
import { Engine } from "./engine"
import { RadialCollisionDetector, RadialRandomWalk } from "./new_point_algos/random_walk"
import { RenderProvider } from "./models"


export function growThenShrinkEngine(canvas: HTMLCanvasElement) {
  const radius = 10
  const addTimeMs = 1000
  const growTimeMs = 1000
  const shrinkTimeMs = 1000

  const providers: Array<RenderProvider> = []

  for (let i = 0; i < 10; i++) {
    providers.push(
      new GrowingDotRenderProvider(canvas, radius, growTimeMs, addTimeMs),
      new ShrinkingDotRenderProvider(canvas, radius, shrinkTimeMs)
    )
  }

  const renderProvider = new ComposingRenderProvider(providers)

  const engine = new Engine(
    new RadialRandomWalk(radius, canvas.width, canvas.height, new RadialCollisionDetector()),
    renderProvider,
    canvas
  )

  return engine
}
