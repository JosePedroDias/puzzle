import { Point } from "pixi.js";

export function add(p1: Point, p2: Point): Point {
    return new Point(
        p1.x + p2.x,
        p1.y + p2.y,
    );
}

export function sub(p1: Point, p2: Point): Point {
    return new Point(
        p1.x - p2.x,
        p1.y - p2.y,
    );
}

export function dist(p1: Point, p2: Point): number {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
}
