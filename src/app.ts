import { getGrowingEngine } from "./growing_dot_fractal"
import { getShrinkingEngine } from "./shrinking_dot_fractal"
import { growThenShrinkEngine } from "./grow_then_shrink_dot_fractal"
import WebMidi from 'webmidi'

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = 300
canvas.height = 485

// @ts-ignore
window.engine = growThenShrinkEngine(canvas)


WebMidi.enable(function (err) {
  if (err) {
    console.log("WebMidi could not be enabled.", err);
  } else {
    console.log("WebMidi enabled!");

    console.log(WebMidi.inputs);
    console.log(WebMidi.outputs);
    console.log(WebMidi.inputs[1])
    WebMidi.inputs[1].addListener('noteon', 'all', console.log)
  }
});