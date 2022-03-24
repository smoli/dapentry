import {GrCircle} from "../geometry/GrCircle";
import {GrRectangle} from "../geometry/GrRectangle";
import {GrLine} from "../geometry/GrLine";

export function distance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.hypot(x2 - x1, y2 - y1);
}

export function midpoint(x1: number, y1: number, x2: number, y2: number): { x: number, y: number } {
    return { x: x1 + (x2 - x1) * 0.5, y: y1 + (y2 - y1) * 0.5 };
}

// Circles
export function circleCenterRadius(name: string, x: number, y: number, r: number):GrCircle {
    return new GrCircle(name, x, y, r);
}

export function circleCenterPoint(name: string, x1: number, y1: number, x2: number, y2: number):GrCircle {
    return new GrCircle(name, x1, y1, distance(x1, y1, x2, y2))
}

export function circlePointPoint(name: string, x1: number, y1: number, x2: number, y2: number): GrCircle {
    const center = midpoint(x1, y1, x2, y2);
    return new GrCircle(name, center.x, center.y, distance(center.x, center.y, x2, y2));
}


// Rectangles
export function rectanglePointPoint(name: string, x1: number, y1: number, x2: number, y2: number):GrRectangle {
    const center = midpoint(x1, y1, x2, y2);
    return new GrRectangle(name, center.x, center.y, Math.abs(x1 - x2), Math.abs(y1 - y2));
}

export function rectangleCenter(name: string, x: number, y: number, width: number, height: number):GrRectangle {
    return new GrRectangle(name, x, y, width, height);
}

export function rectangleTopLeft(name: string, x: number, y: number, width: number, height: number):GrRectangle {
    return new GrRectangle(name, x + width / 2, y + height / 2, width, height);
}

export function rectangleBottomLeft(name: string, x: number, y: number, width: number, height: number):GrRectangle {
    return new GrRectangle(name, x + width / 2, y - height / 2, width, height);
}

export function rectangleBottomRight(name: string, x: number, y: number, width: number, height: number):GrRectangle {
    return new GrRectangle(name, x - width / 2, y - height / 2, width, height);
}

export function rectangleTopRight(name: string, x: number, y: number, width: number, height: number):GrRectangle {
    return new GrRectangle(name, x - width / 2, y + height / 2, width, height);
}

// Lines
export function linePointPoint(name: string, x1: number, y1: number, x2: number, y2: number): GrLine {
    return new GrLine(name, x1, y1, x2, y2);
}

export function linePointVectorLength(name: string, x1: number, y1: number, vx: number, vy: number, l: number):GrLine {
    return new GrLine(name, x1, y1, x1 + vx * l, y1 + vy * l);
}