import { Point } from "pixi.js";
import { createNoise2D } from 'simplex-noise';

import { CUT_MODE_SIMPLE, RANDOMIZE_CUTS } from "../consts";

const noise2DX = createNoise2D();
const noise2DY = createNoise2D();

export type PairFl = [number, number];

function dist(a: PairFl, b: PairFl): number {
    const dx = a[0] - b[0];
    const dy = a[1] - b[1];
    return Math.sqrt(dx*dx + dy*dy);
}

const S = 0.005;

// TODO could use simplex noise 2D instead
function randomizeCut(pts:PairFl[]): PairFl[] {
    return pts.map((p, i) => {
        if (i === 0 || i === pts.length - 1) return p;
        const d1 = dist(p, pts[i - 1]);
        const d2 = dist(p, pts[i + 1]);
        const d = Math.min(d1, d2) * 0.5;

        const xx = noise2DX(S * p[0], S * p[1]); // -1, 1
        const yy = noise2DY(S * p[0], S * p[1]);
        
        return [
            d * xx + p[0],
            d * yy + p[1],
        ]
    });
}

/**
 * 
 * @param axis {number} 0 or 1 for X or Y
 * @param edgeDirection {number} -1 for negative, 1 for positive
 * @param bulgeDirection {number} -1 for negative, 1 for positive
 * @param hasBulge {boolean}
 * @param cx {number} center x
 * @param cy {number} center y
 * @param dx {number} delta x
 * @param dx {number} delta y
 * @returns {Point[]}
 */
export function getCut(
    axis: number,
    edgeDirection: number,
    bulgeDirection: number,
    hasBulge: boolean,
    cx: number, cy: number,
    dx: number, dy: number
): Point[] {
    if (!hasBulge) return [];

    let pts: PairFl[];

    if (CUT_MODE_SIMPLE) {
        pts = [
            [-1.0,  0.0],
            [-0.25, 0.0],
            [-0.25, 0.5],
            [ 0.25, 0.5],
            [ 0.25, 0.0],
            [ 1.0,  0.0],
        ];
    } else {
        pts = [
            [-1.0,  0.0],
            [-0.6, -0.05],
            [-0.25, 0.0],
            [-0.20, 0.1],
            [-0.25, 0.22],
            [-0.20, 0.4],
            [ 0.0,  0.45], // center
            [ 0.20, 0.4],
            [ 0.25, 0.22],
            [ 0.20, 0.1],
            [ 0.25, 0.0],
            [ 0.6, -0.05],
            [ 1.0,  0.0],
        ]
    }

    if (bulgeDirection === -1) pts = pts.map(([a, b]) => [a, -b]);
    if (axis === 1) pts = pts.map(([a, b]) => [b, a]);
    if (edgeDirection === -1) pts.reverse();

    pts = pts.map(([x, y]) => [dx * x + cx, dy * y + cy]);

    if (RANDOMIZE_CUTS) {
        pts = randomizeCut(pts);
    }

    return pts.map(([x, y]) => new Point(x, y));
}

