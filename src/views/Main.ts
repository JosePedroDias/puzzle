import {
    Application,
    Container,
    Sprite,
    Texture,
    Graphics,
} from "pixi.js";
import { Piece } from "./Piece";
import { DEBUG_VISUALS, DRAW_BG, HI, SHUFFLE, TEX_PATH, THICKNESS, WI } from "../consts";
import { populateNeighborLookup } from "../logic/neighbors";
import { onKeyChange, setupKeyListening } from "../logic/kbd";

export class Main extends Container {
    constructor(public app: Application) {
        super();

        const stage = new Container();

        if (!DRAW_BG) {
            setupKeyListening();
            onKeyChange('Space', (isDown) => {
                let i = 0;
                for (const o of stage.children) {
                    if (i === 0) { // @ts-ignore
                        o.children[0].visible = isDown;
                    } else {
                        o.visible = !isDown;
                    }
                    ++i;
                }
            });
        }

        const tex = Texture.from(TEX_PATH);

        tex.baseTexture.resource.load().then(() => {
            const W = tex.width;
            const H = tex.height;

            const SW = app.screen.width;
            const SH = app.screen.height;

            stage.position.set(
                (SW - W) / 2,
                (SH - H) / 2,
            );

            const bgSp = new Sprite(tex);
            
            if (DRAW_BG) {
                bgSp.alpha = 0.5;
                stage.addChild(bgSp);
            } else {
                const bgG = new Graphics()
                .lineStyle(0.75, 0x000000, 1) // width, color, alpha
                .drawRect(0, 0, W, H)
                .endFill();
                bgG.addChild(bgSp);
                stage.addChild(bgG);
                bgSp.visible = false;
            };
    
            // console.log(`cols: ${WI}, rows: ${HI}, pieces: ${WI * HI}`);

            const dw = 1 / WI;
            const dh = 1 / HI;

            const pieces: Piece[] = [];

            for (let yi = 0; yi < HI; ++yi) {
                const firstY = yi === 0;
                const lastY = yi === HI - 1;
                for (let xi = 0; xi < WI; ++xi) {
                    const firstX = xi === 0;
                    const lastX = xi === WI - 1;
                    //if (xi !== 1 || yi !== 1) continue;
                    const mode = (xi + yi) % 2;
                    const label = `${xi},${yi}`;
                    const p = new Piece(tex, xi * dw, yi * dh, dw, dh, firstX, lastX, firstY, lastY, mode, THICKNESS, label);
                    stage.addChild(p);
                    pieces.push(p);
                }
            }

            populateNeighborLookup(pieces);

            if (SHUFFLE) {
                const d = 120;
                for (const p of pieces) {
                    if (DEBUG_VISUALS) {
                        p.position.x += (Math.random() - 0.5) * d;
                        p.position.y += (Math.random() - 0.5) * d;
                    } else {
                        p.position.x = W * Math.random();
                        p.position.y = H * Math.random();
                    }   
                }
            }
        });

        this.addChild(stage);
    }
}
