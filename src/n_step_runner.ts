import { Engine } from "./engine"

export class NStepRunner {
  constructor(private engine: Engine<any, any>, private canvas: HTMLCanvasElement) {}

  public run(nSteps: number) {
    for (let i = 0; i < nSteps; i++) {
      if (this.engine.generatePoint()) {
        console.log("added point")
        this.engine.renderAndUpdateAll(undefined)
      }
    }
    console.log(`Done adding ${nSteps} dots`)
  }

  public startCollectingPointsFromClicks = () => {
    this.canvas.onclick = (e) => {
      const newPoint = { x: e.clientX, y: e.clientY }
      console.log("Adding point from click", newPoint)
      this.engine.addPoint(newPoint)
      this.engine.renderAndUpdateAll(undefined)
    }
  }

  public stopCollectingPointsFromClicks = () => {
    this.canvas.onclick = () => {}
  }
}