import { HashOfStrings, getParam, setParams } from "./logic/query";

const IMAGES = [
    '/assets/bgs/52_1000_750.jpg', // deck
    '/assets/bgs/58_1000_750.jpg', // b&w lighthouse
    '/assets/bgs/65_1000_750.jpg', // girl's hair in warm sunny afternoon
    '/assets/bgs/66_1000_750.jpg', // prairie
    '/assets/bgs/69_1000_750.jpg', // train tracks
    '/assets/bgs/421_1000_750.jpg', // foggy beach
    '/assets/bgs/487_1000_750.jpg', // vegetation close-up
    '/assets/bgs/502_1000_750.jpg', // wood trees
];

function int(s: string) { return parseInt(s, 10); }
function bool(s: string) { s = s.toLowerCase(); return !(s === 'false' || s === '0' || s === ''); }

const cfg = {
    puzzleNr: int(getParam('puzzleNr')),
    wi: int(getParam('wi')),
    hi: int(getParam('hi')),

    //shuffle: bool(getParam('shuffle')),
    drawBg: bool(getParam('drawBg')),
    debugVisuals: bool(getParam('debugVisuals')),
    randomCuts: bool(getParam('randomCuts')),
    simpleCuts: bool(getParam('simpleCuts')),
};

let isDirty = false;

console.log(cfg);

if (isNaN(cfg.wi)) { cfg.wi = 6; isDirty = true; }
if (isNaN(cfg.hi)) { cfg.hi = Math.floor( 3/4 * cfg.wi ); isDirty = true; }
if (isNaN(cfg.puzzleNr) || cfg.puzzleNr < 0 || cfg.puzzleNr >= IMAGES.length) { 
    cfg.puzzleNr = (cfg.puzzleNr >= IMAGES.length) ? IMAGES.length - 1 : 0;
    isDirty = true;
 }

export const WI = cfg.wi;
export const HI = cfg.hi;
export const TEX_PATH = IMAGES[cfg.puzzleNr];

if (isDirty) {
    setParams(cfg as any as HashOfStrings);
}

export const THICKNESS = WI < 6 ? 5 : WI >= 9 ? 3 : 4;
export const CONNECT_PIECE_DIST = 8;

export const SHUFFLE = true; //cfg.shuffle;
export const DRAW_BG = cfg.drawBg;

export const CUT_MODE_SIMPLE = cfg.simpleCuts;
export const RANDOMIZE_CUTS = cfg.randomCuts;

export const DEBUG_VISUALS = cfg.debugVisuals;
