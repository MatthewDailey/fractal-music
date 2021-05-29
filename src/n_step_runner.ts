import { Engine } from "./engine"

export class NStepRunner {
  constructor(private engine: Engine<any, any>) {}

  public run(nSteps: number) {
    for (let i = 0; i < nSteps; i++) {
      this.engine.generatePoint()
      console.log("added point")
    }
    this.engine.renderAndUpdateAll(undefined)
  }
}