# TODO

- [x] detect connected pieces against bg
- [x] detect connected pieces against other islands
- [x] add harder mode where bg only appear isolated on key press instead of always
- [x] randomize cuts instead of reusing the same
- [ ] bug: when joining 2 multi-piece islands, sometimes a gap remains between pieces
- [ ] make viewport adapt to mobile and window resizes
- [ ] show shadow during drag?
- [ ] optimize rendering and picking performance - maybe use cacheAsBitmap?

## example puzzles:

image #0 6x4
http://127.0.0.1:8080/?puzzleNr=0&wi=6&hi=4&drawBg=false&debugVisuals=false&randomCuts=true&simpleCuts=false

image #4 9x6
http://127.0.0.1:8080/?puzzleNr=4&wi=9&hi=6&drawBg=false&debugVisuals=false&randomCuts=true&simpleCuts=false

simpleCuts makes the puzzle piece cuttings polygonal
http://127.0.0.1:8080/?puzzleNr=0&wi=6&hi=4&drawBg=false&debugVisuals=false&randomCuts=true&simpleCuts=true

debug (shuffle is minimal, shows labels, tints islands, logs island contents and ops)
http://127.0.0.1:8080/?puzzleNr=0&wi=6&hi=4&drawBg=false&debugVisuals=true&randomCuts=true&simpleCuts=false


## upgrade 

- https://github.com/pixijs/pixijs/wiki/v7-Migration-Guide
- https://filters.pixijs.download/main/docs/index.html
- https://pixijs.io/guides/basics/graphics.html
