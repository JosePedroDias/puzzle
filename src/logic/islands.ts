import { Piece } from "../views/Piece";
import { union } from './setOps';
import { randomTint, toHex } from "./colors";
import { DEBUG_VISUALS } from "../consts";

export type Island = Set<Piece>;

export const islands: Island[] = [];
export const islandColors: number[] = [];

export function getIslandIndex(island: Island): number {
    return islands.indexOf(island);
}

export function getIslandAndTint(piece: Piece, autoCreate=false): [Island, number] | undefined {
    let isl: Island | undefined;
    for (const island of islands) {
        if (island.has(piece)) {
            isl = island;
            break;
        }
    }
    if (!isl) {
        if (!autoCreate) return undefined;
        isl = createIslandWith(piece);
    }
    return [isl, islandColors[islands.indexOf(isl)]];
}

export function createIslandWith(piece: Piece): Island {
    const island = new Set([piece]);
    const tint = DEBUG_VISUALS ? randomTint(108, 148) : 0xFFFFFF;
    piece.tint = tint;
    islandColors.push(tint);
    islands.push(island);
    return island;
}

export function addToIsland(piece: Piece, island: Island) {
    island.add(piece);
}

export function removeFromIsland(piece: Piece) {
    const pair = getIslandAndTint(piece);
    if (!pair) return;
    const [island] = pair;
    if (!island) return;
    island.delete(piece);
    if (island.size === 0) {
        const idx = islands.indexOf(island);
        islands.splice(idx, 1);
        islandColors.splice(idx, 1);
    }
}

export function joinIslands(i1: Island, i2: Island) {
    let idx1 = islands.indexOf(i1);
    let idx2 = islands.indexOf(i2);

    const tint1 = islandColors[idx1];

    if (idx1 > idx2) {
        const tmp = idx1;
        idx1 = idx2;
        idx2 = tmp;
    }

    islands.splice(idx2, 1);
    islandColors.splice(idx2, 1);

    const i1ori2 = union(i1, i2);
    islands[idx1] = i1ori2;

    for (const p of Array.from(i1ori2)) p.tint = tint1;
}

export function logIslands() {
    for (let i = 0; i < islands.length; ++i) {
        const isl = islands[i];
        const tint = islandColors[i];
        console.log(`%c#${i} ${Array.from(isl).map((p)=>p.label).join('; ')}`, `background: ${toHex(tint)}`);
    }
}
