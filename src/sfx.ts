import { Howl } from 'howler';

// type Key = 'drag' | 'drop' | 'connect';

const sfxMap: { [key: string]: string } = {
    drag: 'drag.mp3',
    drop: 'drop.mp3',
    connect: 'connect.mp3',
};

export const sfx: { [key: string]: Howl } = Object.entries(sfxMap).reduce((o, [k, v]) => {
    o[k] = new Howl({ src: [`assets/sounds/${v}`]});
    return o;
}, {} as { [key: string]: Howl });
