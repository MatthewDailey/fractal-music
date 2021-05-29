import { Engine } from "./engine"


export class ConsoleRunner {
  constructor(private engine: Engine<any, any>, private canvas: HTMLCanvasElement) {}

  public outputPoints = () => this.engine.getPointsAsJson()
  public inputPoints = (pointsStr: string) => this.engine.setPointsFromJson(pointsStr)

  public startPointsFromClicks = () => {
    this.canvas.onclick = (e) => console.log(e)
  }
}

