import { Engine } from "./engine"
import { DotCollisionDetector, DotRenderablePoint, RandomWalk } from "./dot_fractal"
import { NStepRunner } from "./n_step_runner"

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const stepSize = 10

const engine = new Engine(
  new DotCollisionDetector(stepSize),
  new RandomWalk(stepSize, canvas.width, canvas.height),
  (c, p) => new DotRenderablePoint(c, p),
  canvas
)

engine.addPoint({x: 10, y: 10})

const runner = new NStepRunner(engine)
runner.run(100)
