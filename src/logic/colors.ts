export function randomTint(channelAdd = 128, channelRnd = 128) {
    const r = channelAdd + Math.floor(channelRnd * Math.random());
    const g = channelAdd + Math.floor(channelRnd * Math.random());
    const b = channelAdd + Math.floor(channelRnd * Math.random());
    return r << 16 | g << 8 | b;
}

function zeroPad(n: number | string): string {
    const s = n.toString();
    if (s.length === 1) return `0${s}`;
    return s;
}

export function toHex(n: number): string {
    const r = (n & 0xFF0000) >> 16;
    const g = (n & 0x00FF00) >> 8;
    const b = (n & 0x0000FF);
    return `#${zeroPad(r.toString(16))}${zeroPad(g.toString(16))}${zeroPad(b.toString(16))}`
}
