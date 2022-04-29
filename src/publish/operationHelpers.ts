import {GrCircle} from "../geometry/GrCircle";
import {GrRectangle} from "../geometry/GrRectangle";
import {GrLine} from "../geometry/GrLine";
import {GrObject, ObjectType, POI, POIPurpose} from "../geometry/GrObject";
import {Point2D} from "../geometry/Point2D";
import {makeScaleFactorsUniform, scaleToAPoint} from "../geometry/GeoMath";
import {GrObjectList} from "../geometry/GrObjectList";
import {GrPolygon} from "../geometry/GrPolygon";
import {GrText} from "../geometry/GrText";

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

// Text
export function text(name: string, x: number, y: number, text: string):GrText {
    return new GrText(name, x, y, text);
}

// Polygon
export function polygon(name: string, object: GrObject, closed: boolean, points: Array<{x: number, y: number}>): GrPolygon {
    let poly: GrPolygon;
    if (object) {
        poly = object as GrPolygon;
        poly.addPoints(points.map(p => new Point2D(p.x, p.y)))
    } else {
        poly = new GrPolygon(name, points.map(p => new Point2D(p.x, p.y)), closed);
    }

    return poly;
}

export function extendPolygon(object: GrPolygon, points: Array<{x: number, y: number}>) {
    object.addPoints(points.map(p => new Point2D(p.x, p.y)));
}



// Scaling
export function scaleObject(object: GrObject, fx: number, fy: number, pivotX: number, pivotY: number) {
    object.scale(fx, fy, new Point2D(pivotX, pivotY))
}

export function scaleObjectUniform(object: GrObject, f: number, pivotX: number, pivotY: number) {
    object.scale(f, f, new Point2D(pivotX, pivotY))
}


function computeFactorsForScaleToPoint(object: GrObject, draggedX: number, draggedY: number, targetX: number, targetY: number, pivotX: number, pivotY: number) {
    let old = new Point2D(draggedX, draggedY);
    let target = new Point2D(targetX, targetY);
    let pivot = new Point2D(pivotX, pivotY);

    old = object.mapPointToLocal(old);
    pivot = object.mapPointToLocal(pivot);
    target = object.mapPointToLocal(target);

    return scaleToAPoint(old, pivot, target);
}

export function scaleObjectToPoint(object: GrObject, draggedX: number, draggedY: number, targetX: number, targetY: number, pivotX: number, pivotY: number) {
    let { fx, fy } = computeFactorsForScaleToPoint(object, draggedX, draggedY, targetX, targetY, pivotX, pivotY);
    object.scale(fx, fy, new Point2D(pivotX, pivotY))
}

export function scaleObjectToPointUniform(object: GrObject, draggedX: number, draggedY: number, targetX: number, targetY: number, pivotX: number, pivotY: number) {
    let { fx, fy } = computeFactorsForScaleToPoint(object, draggedX, draggedY, targetX, targetY, pivotX, pivotY);
    fy = fx = makeScaleFactorsUniform(fx, fy);
    object.scale(fx, fy, new Point2D(pivotX, pivotY))
}

// Moving
export function moveObject(object: GrObject, point: POI, vx: number, vy: number) {
    object.movePOI(point, new Point2D(vx, vy));
}

export function moveObjectAlongX(object: GrObject, point: POI, vx: number) {
    object.movePOI(point, new Point2D(vx, 0));
}

export function moveObjectAlongY(object: GrObject, point: POI, vy: number) {
    object.movePOI(point, new Point2D(0, vy));
}

export function moveObjectToPoint(object: GrObject, point: POI, targetObject: GrObject, targetPoint: POI) {

    let to;
    let from;

    if (object === targetObject && object.type === ObjectType.List && (object as GrObjectList).objects.length > 1) {
        const l = (object as GrObjectList).objects.length;
        to = (object as GrObjectList).objects[l - 2].pointsOfInterest(POIPurpose.MANIPULATION)[targetPoint];
        from = (object as GrObjectList).objects[l - 1].pointsOfInterest(POIPurpose.MANIPULATION)[point];
    } else {
        to = targetObject.pointsOfInterest(POIPurpose.MANIPULATION)[targetPoint];
        from = object.pointsOfInterest(POIPurpose.MANIPULATION)[point];
    }

    const v = to.copy.sub(from);
    object.movePOI(point, v);
}

// Rotate
export function rotateObject(object: GrObject, angleDeg: number, pivotX: number, pivotY: number) {
    object.rotateByDeg(angleDeg, new Point2D(pivotX, pivotY));
}


// Math functions

export function size(value: Array<any>):number {
    return value.length;
}

export function max(value: Array<number>): number {
    return Math.max.apply(null, value);
}

export function avg(value: Array<number>): number {
    return value.reduce((a, b) => a + b) / value.length;
}

export function median(value: Array<number>): number {
    const s = [...value].sort((a, b) => a - b);
    const c = Math.floor(s.length / 2);

    let r = s[c]

    if (s.length % 2 === 0) {
        r = r + s[c - 1];
        return r / 2;
    }

    return r
}
