import { Point, Sprite, Texture } from "pixi.js";

import { Piece } from "../views/Piece";
import { CONNECT_PIECE_DIST, DEBUG_VISUALS, WI } from "../consts";
import { dist, sub } from "./pointOps";
import { Island, addToIsland, getIslandAndTint, getIslandIndex, joinIslands, removeFromIsland } from "./islands";

type NeighborSlot = {
    piece: Piece;
    delta: Point;
}

export type NeighborData = {
    beforeX?: NeighborSlot;
    afterX?: NeighborSlot;
    beforeY?: NeighborSlot;
    afterY?: NeighborSlot;
}

export const neighborLookup = new Map<Piece, NeighborData>();

export function populateNeighborLookup(pieces: Piece[]) {
    for (let i = 0; i < pieces.length; ++i) {
        const p = pieces[i];
        let p2;
        const pd: NeighborData = {};
        if (!p.firstX) {
            p2 = pieces[i - 1];
            pd.beforeX = { piece: p2, delta: sub(p2.position, p.position) };
        }
        if (!p.lastX) {
            p2 = pieces[i + 1];
            pd.afterX = { piece: p2, delta: sub(p2.position, p.position) };
        }
        if (!p.firstY) {
            p2 = pieces[i - WI];
            pd.beforeY = { piece: p2, delta: sub(p2.position, p.position) };
        }
        if (!p.lastY) {
            p2 = pieces[i + WI];
            pd.afterY = { piece: p2, delta: sub(p2.position, p.position) };
        }
        neighborLookup.set(p, pd);
    }
    // console.warn('neighborLookup', neighborLookup);
}

export function checkGoal(pieces: Piece[]): boolean {
    let connectedCount = 0;
    for (const p of pieces) {
        if (!p.interactive) ++connectedCount;
    }
    const ratio = `${connectedCount} / ${pieces.length} (${(connectedCount * 100 / pieces.length).toFixed(0)}%)`
    document.title = ratio;

    return connectedCount === pieces.length;
}

export function isCloseToPos(piece: Piece, p: Point): boolean {
    return dist(p, piece.position) < CONNECT_PIECE_DIST;
}

export function isCloseToNeighbor(piece: Piece): [Point, Piece] | undefined {
    let skipThesePieces: Set<Piece> = new Set();
    const pair = getIslandAndTint(piece, false);
    if (pair) {
        const [island] = pair;
        skipThesePieces = island;
    }

    const nd = neighborLookup.get(piece);

    if (!nd) return;

    let leastDist = Number.POSITIVE_INFINITY;
    let leastPos: Point | undefined;
    let leastNeighbor: Piece | undefined;

    const slots = Object.values(nd);
    for (const slot of slots) {
        const otherPiece = slot.piece;
        if (skipThesePieces.has(otherPiece)) continue;
        const goalPos = sub(otherPiece.position, slot.delta);
        const d = dist(piece.position, goalPos);
        // console.log(d.toFixed(1), otherPiece.label);
        if (d < leastDist && d < CONNECT_PIECE_DIST) {
            leastPos = goalPos;
            leastDist = d;
            leastNeighbor = otherPiece;
        }
    }

    if (leastPos && leastNeighbor) {
        return [leastPos, leastNeighbor];
    }
}

const checkTex = Texture.from(`assets/sprites/check.png`);

export function handleConnectedPiece(piece: Piece, goalPos: Point, neighbor: Piece | undefined) {
    piece.position.copyFrom(goalPos);
    if (neighbor) {
        const [otherIsland, tint] = getIslandAndTint(neighbor, true) as any as [Island, number];
        const myPair = getIslandAndTint(piece, false);
        if (myPair && myPair[0] === otherIsland) {
            DEBUG_VISUALS && console.log(`same island #${getIslandIndex(otherIsland)}, noop`);
        } else if (myPair) {
            const [myIsland] = myPair;
            DEBUG_VISUALS && console.log(`joining islands #${getIslandIndex(myIsland)} and #${getIslandIndex(otherIsland)}`);
            joinIslands(myIsland, otherIsland);
        } else {
            DEBUG_VISUALS && console.log(`add this piece to ${otherIsland.size === 1 ? 'a new' : 'an old'} island`);
            addToIsland(piece, otherIsland);
            piece.tint = tint;
        }
    } else {
        piece.interactive = false;
        piece.tint = 0xFFFFFF;
        piece.parent.addChildAt(piece, 1);
        removeFromIsland(piece);

        const checkSp = Sprite.from(checkTex);
        checkSp.anchor.set(0.5);
        checkSp.scale.set(0.15);
        checkSp.alpha = 0.5;
        checkSp.position.copyFrom(piece.position);
        piece.parent.addChildAt(checkSp, 2);

        const pieces = piece.parent.children.filter((o) => 'goalPosition' in o) as Piece[];
        checkGoal(pieces);
    }
}