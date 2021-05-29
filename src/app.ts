import { DotRenderProvider } from "./dot_fractal"
import { Engine } from "./engine"
import { RadialCollisionDetector, RadialRandomWalk } from "./new_point_algos/random_walk"

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = 300
canvas.height = 485

const radius = 2
const engine = new Engine(
  new RadialRandomWalk(radius, canvas.width, canvas.height, new RadialCollisionDetector()),
  new DotRenderProvider(radius, 500, 100),
  canvas
)

// @ts-ignore
window.engine = engine
