import { Graphics, Sprite, Texture, Point, Text } from "pixi.js";
import { BevelFilter, BevelFilterOptions } from '@pixi/filter-bevel';

import { setDraggable } from "../logic/draggable";
import { getCut } from "../logic/cuts";
import { DEBUG_VISUALS } from "../consts";

const bevelOpts: BevelFilterOptions = {
    rotation: 45,
    lightColor: 0xFFFFFF,
    shadowColor: 0x000000,
    lightAlpha: 0.33,
    shadowAlpha: 0.33,
    thickness: 4,
};

export class Piece extends Sprite {
    goalPosition: Point = new Point();

    constructor(
        public tex: Texture,
        x: number, y: number,
        w: number, h: number,
        public firstX: boolean, public lastX: boolean,
        public firstY: boolean, public lastY: boolean,
        mode: number,
        thickness: number = 0,
        public label: string = ''
    ) {
        super(tex);

        const W = tex.width;
        const H = tex.height;
        // console.log(`W:${W}, H:${H}`);

        const x0 = W * x;
        const x1 = W * (x + w);
        const y0 = H * y;
        const y1 = H * (y + h);

        const cx = (x0 + x1) / 2;
        const cy = (y0 + y1) / 2;
        const realDx = (x1 - x0);
        const realDy = (y1 - y0);
        const dx = realDx * 0.45; // half. a little less to avoid repeating a corner point
        const dy = realDy * 0.45;

        const sign = mode ? -1 : 1;

        let points: Point[] = [];
        points.push(new Point(x0, y0));

        // top
        points = [...points, ...getCut(0, 1, 1 * sign, !firstY, cx, y0, dx, dy) ];

        points.push(new Point(x1, y0));

        // right
        points = [...points, ...getCut(1, 1, 1 * sign, !lastX, x1, cy, dx, dy) ];

        points.push(new Point(x1, y1));

        // bottom
        points = [...points, ...getCut(0, -1, -1 * sign, !lastY, cx, y1, dx, dy) ];

        points.push(new Point(x0, y1));

        // left
        points = [...points, ...getCut(1, -1, -1 * sign, !firstX, x0, cy, dx, dy) ];

        const g = new Graphics()
            .beginFill()
            .drawPolygon(points)
            .endFill();

        // @ts-ignore
        this.mask = g;
        this.addChild(g);

        if (thickness) {
            bevelOpts.thickness = thickness;
            this.filters = [new BevelFilter(bevelOpts)];
        }
        
        this.pivot.x = cx;
        this.pivot.y = cy;

        this.position.x = x0 + realDx/2;
        this.position.y = y0 + realDy/2;

        this.goalPosition.copyFrom(this.position);

        if (label && DEBUG_VISUALS) {
            const t = new Text(label, { fontSize: 13 });
            t.anchor.set(0.5);
            t.alpha = 0.5;
            t.position.copyFrom(this.position);
            this.addChild(t);
        }

        setDraggable(this);
    }
}
