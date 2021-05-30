### Setting up local MIDI

I installed DM1 from the MacStore as an input (it's a drum machine).

Used webmidi.js to access midi input https://github.com/djipco/webmidi

Webmidi will see the DM1 midi input but be unable to see any events

To solve this I enabled IAC MIDI bus. This is already on osx by default with the "Audi MIDI Setup" tool.

Once enabling that, webmidi saw 2 inputs and could see

In DM1, had to enable notes being sent to the IAC bus via midi tab. 
