import { getGrowingEngine } from "./growing_dot_fractal"
import { getShrinkingEngine } from "./shrinking_dot_fractal"

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = 300
canvas.height = 485

// @ts-ignore
window.engine = getShrinkingEngine(canvas)
