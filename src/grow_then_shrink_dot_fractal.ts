import { ComposingRenderProvider } from "./composing_render_provider"
import { GrowingDotRenderer } from "./growing_dot_fractal"
import { ShrinkingDotRenderer } from "./shrinking_dot_fractal"
import { Engine } from "./engine"
import { RadialCollisionDetector, RadialRandomWalk } from "./new_point_algos/random_walk"
import { FillProvider, Renderer } from "./models"
import { WhiteFillProvider } from "./white_fill_provider"
import { MidiFillProvider } from "./midi_fill_provider"


export function growThenShrinkEngine(canvas: HTMLCanvasElement) {
  const radius = 10
  const addTimeMs = 1000
  const growTimeMs = 1000
  const shrinkTimeMs = 1000
  const colorFadeTime = 500

  const providers: Array<Renderer> = []

  const fillProvider = new MidiFillProvider(colorFadeTime)

  for (let i = 0; i < 10; i++) {
    providers.push(
      new GrowingDotRenderer(canvas, radius, fillProvider, growTimeMs, addTimeMs),
      new ShrinkingDotRenderer(canvas, radius, fillProvider, shrinkTimeMs)
    )
  }

  const renderProvider = new ComposingRenderProvider(providers)

  const engine = new Engine(
    new RadialRandomWalk(radius, canvas.width, canvas.height, new RadialCollisionDetector()),
    renderProvider,
    canvas
  )
  fillProvider.startListeningToMidiBus()

  engine.addPoint({ x: canvas.width / 2, y: canvas.height / 2 })
  engine.run(9)

  return engine
}
