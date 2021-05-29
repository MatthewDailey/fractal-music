import { DotRenderProvider } from "./dot_fractal"
import { Engine } from "./engine"
import { RadialCollisionDetector, RandomWalk } from "./new_point_algos/random_walk"
import { NStepRunner } from "./n_step_runner"

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

const radius = 10
const engine = new Engine(
  new RandomWalk(radius, canvas.width, canvas.height, new RadialCollisionDetector()),
  new DotRenderProvider(radius),
  canvas
)

const runner = new NStepRunner(engine, canvas)

// @ts-ignore
window.engine = engine
// @ts-ignore
window.runner = runner
