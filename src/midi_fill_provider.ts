import { FillProvider, Point } from "./models"
import WebMidi from 'webmidi'

export class MidiFillProvider implements FillProvider {

  private static colors = [
    '#CC99C9',
    '#9EC1CF',
    '#9EE09E',
    '#FDF097',
    '#FEB144',
    '#FF6663',
  ]

  // initialize -1 so first note goes to first color in list
  private colorIndex: number = -1
  private mostRecentNoteMs: number|null = null

  constructor(private decayTimeMs: number) {}

  public startListeningToMidiBus() {
    const parentProvider = this
    WebMidi.enable(function (err) {
      if (err) {
        console.log("WebMidi could not be enabled.", err);
      } else {
        console.log("WebMidi enabled!");
        WebMidi.inputs[1].addListener('noteon', 'all', (e) => {
          parentProvider.colorIndex = (parentProvider.colorIndex+1) % MidiFillProvider.colors.length
          parentProvider.mostRecentNoteMs = Date.now()
          console.log(e)
        })
      }
    });
  }

  getFill(point: Point, index: number, length: number): string {
    if (!this.mostRecentNoteMs) {
      return '#ffffff00'
    }

    const timeSinceNoteMs = Date.now() - this.mostRecentNoteMs
    if (timeSinceNoteMs < this.decayTimeMs) {
      const alpha = Math.round(100 * ((this.decayTimeMs - timeSinceNoteMs) / this.decayTimeMs))
      console.log(alpha)
      const color = MidiFillProvider.colors[this.colorIndex]
      return `${color}${alpha.toString(16)}`
    }

    return '#ffffff00'
  }

}