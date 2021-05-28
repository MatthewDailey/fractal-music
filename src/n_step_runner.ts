import { Engine } from "./engine"

export class NStepRunner {
  constructor(private engine: Engine<any>) {}

  public run(nSteps: number) {
    for (let i = 0; i < nSteps; i++) {
      this.engine.generatePoint()
    }
    this.engine.renderAndUpdateAll()
  }
}