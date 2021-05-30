import { ComposingRenderProvider } from "./composing_render_provider"
import { GrowingDotRenderer } from "./growing_dot_fractal"
import { ShrinkingDotRenderer } from "./shrinking_dot_fractal"
import { Engine } from "./engine"
import { RadialCollisionDetector, RadialRandomWalk } from "./new_point_algos/random_walk"
import { Renderer } from "./models"
import { WhiteFillProvider } from "./white_fill_provider"


export function growThenShrinkEngine(canvas: HTMLCanvasElement) {
  const radius = 10
  const addTimeMs = 1000
  const growTimeMs = 1000
  const shrinkTimeMs = 1000

  const providers: Array<Renderer> = []

  for (let i = 0; i < 10; i++) {
    providers.push(
      new GrowingDotRenderer(canvas, radius, new WhiteFillProvider(), growTimeMs, addTimeMs),
      new ShrinkingDotRenderer(canvas, radius, new WhiteFillProvider(), shrinkTimeMs)
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
