import {Point2D} from "./Point2D";
import {ScaleMode} from "./GrObject";


export function rad2deg(rad: number): number {
    return (rad * 180) / Math.PI
}

export function deg2rad(deg: number): number {
    return (deg * Math.PI) / 180
}

export function rotate(p: Point2D, angle: number): Point2D {
    const s = Math.sin(angle);
    const c = Math.cos(angle);

    return new Point2D(
        p.x * c - p.y * s,
        p.x * s + p.y * c
    );
}


export function rotatePivot(p: Point2D, angle: number, pivot: Point2D): Point2D {
    const s = Math.sin(angle);
    const c = Math.cos(angle);

    const x = p.x - pivot.x;
    const y = p.y - pivot.y;

    return new Point2D(
        x * c - y * s + pivot.x,
        x * s + y * c + pivot.y
    );
}


export function scaleToAPoint(oldPoint: Point2D, pivot: Point2D, newPoint: Point2D): { fx: number, fy: number } {

    const oldDx = oldPoint.x - pivot.x;
    const oldDy = oldPoint.y - pivot.y;

    const newDx = newPoint.x - pivot.x;
    const newDy = newPoint.y - pivot.y;

    let fx = eq(oldDx, 0) ? 1 : newDx / oldDx;
    let fy = eq(oldDy, 0) ? 1: newDy / oldDy;

    return { fx, fy };
}

export function  makeScaleFactorsUniform(fx:number, fy:number): number {
    return Math.max(fx, fy);
}

/**
 * Epsilon: Used for equality testing. Everything that's less distant than EPSILON is
 * considered equal
 * @type {number}
 */
export const EPSILON = 1e-07;

export const TWO_PI = Math.PI * 2;

/**
 * Test for equality
 * @param a
 * @param b
 * @returns {boolean}
 */
export function eq(a, b) {
    return Math.abs(a - b) <= EPSILON;
}

export function eqp(p1, p2) {
    return eq(p1.x, p2.x) && eq(p1.y, p2.y);
}
