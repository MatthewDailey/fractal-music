import { getFractalEngine } from "./growing_dot_fractal"

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = 300
canvas.height = 485

// @ts-ignore
window.engine = getFractalEngine(canvas)
