import { DisplayObject, InteractionData, InteractionEvent, Point } from "pixi.js";

import { sfx } from '../sfx';
import { Piece } from "../views/Piece";
import { isCloseToPos, handleConnectedPiece, isCloseToNeighbor } from "./neighbors";
import { getIslandAndTint, logIslands } from "./islands";
import { DEBUG_VISUALS } from "../consts";

export interface DragObject extends DisplayObject {
    dragData: InteractionData;
    dragging: number;
    dragPointerStart: DisplayObject;
    dragObjStart: Point;
    dragGlobalStart: Point;
    goalPosition: Point;
}

type PieceDO = Piece & DragObject;

let piecesBeingDragged: Piece[] = [];

function onDragStart(event: InteractionEvent) {
    const obj = event.currentTarget as DragObject
    obj.dragData = event.data;
    obj.dragging = 1;

    // @ts-ignore
    window.p = obj;

    const piece = obj as unknown as Piece;
    const pair = getIslandAndTint(piece);

    if (pair) {
        const [island] = pair;
        piecesBeingDragged = Array.from(island);
    } else {
        piecesBeingDragged = [piece];
    }

    for (let p of piecesBeingDragged as PieceDO[]) {
        const parent = p.parent;
        parent.removeChild(p);
        parent.addChild(p);

        p.dragPointerStart = event.data.getLocalPosition(p.parent);
        p.dragObjStart = new Point();
        p.dragObjStart.copyFrom(p.position);
        p.dragGlobalStart = new Point();
        p.dragGlobalStart.copyFrom(event.data.global);
    }
    sfx['drag'].play();
}

function onDragEnd(event: InteractionEvent) {
    const obj = event.currentTarget as DragObject;
    if (!obj.dragging) return;

    if (DEBUG_VISUALS) {
        console.warn('BEFORE:');
        logIslands();
    }
    

    for (const obj of piecesBeingDragged as PieceDO[]) {
        obj.dragging = 0;
        const piece = obj as any as Piece;
        let goalPos: Point | undefined;
        let neighbor: Piece | undefined;

        if (isCloseToPos(piece, piece.goalPosition)) {
            goalPos = piece.goalPosition;
            DEBUG_VISUALS && console.log('to board');
        } 

        if (!goalPos) {
            const pair = isCloseToNeighbor(piece);
            if (pair) {
                [ goalPos, neighbor ] = pair;
                DEBUG_VISUALS && console.log('to piece');
            }
        }

        if (goalPos) {
            sfx['connect'].play();
            handleConnectedPiece(piece, goalPos, neighbor);
        } else {
            sfx['drop'].play();
            DEBUG_VISUALS && console.log('no connection');
        }
    }

    if (DEBUG_VISUALS) {
        console.warn('AFTER:');
        logIslands();
    }
}

function onDragMove(event: InteractionEvent) {
    const obj = event.currentTarget as DragObject;
    if (!obj.dragging) return;

    const data = obj.dragData;

    for (const obj of piecesBeingDragged as PieceDO[]) {
        const dragPointerEnd = data.getLocalPosition(obj.parent);
        obj.position.set(
            obj.dragObjStart.x + (dragPointerEnd.x - obj.dragPointerStart.x),
            obj.dragObjStart.y + (dragPointerEnd.y - obj.dragPointerStart.y)
        )
    }
}

export function setDraggable(obj: DisplayObject) {
    obj.interactive = true;
    obj.buttonMode = true;

    obj.on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);
}
