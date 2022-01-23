import {Line2D} from "./Line2D";
import {eq} from "./GeoMath";

export class Point2D {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    get copy(): Point2D {
        return new Point2D(this.x, this.y);
    }

    add(p: Point2D): Point2D {
        this.x += p.x;
        this.y += p.y;
        return this;
    }

    sub(p: Point2D): Point2D {
        this.x -= p.x;
        this.y -= p.y;
        return this;
    }

    scale(f: number): Point2D {
        this.x *= f;
        this.y *= f;
        return this;
    }

    dot(p: Point2D): Point2D {
        return new Point2D(this.x * p.x, this.y * p.y);
    }

    /**
     * Rotate
     * @param angle
     * @param pivot
     */
    rotate(angle: number, pivot?: Point2D): Point2D {
        const s = Math.sin(angle);
        const c = Math.cos(angle);

        if (!pivot) {
            let x;
            x = this.x * c - this.y * s;
            this.y = this.x * s + this.y * c
            this.x = x;
        } else {
            let x;
            x = (this.x - pivot.x) * c - (this.y - pivot.y) * s + pivot.x;
            this.y = (this.x - pivot.x) * s + (this.y - pivot.y) * c + pivot.y;
            this.x = x;
        }

        return this;
    }

    /**
     * Turn into unit length vector
     */
    normalize(): Point2D {
        return this.scale(1 / this.length);
    }

    get length(): number {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    /**
     * Returns the angle between v2 and this in rad.
     * @param v2
     */
    angleTo(v2: Point2D): number {
        return Math.atan2(this.y, this.x) - Math.atan2(v2.y, v2.x);
    }

    distanceToPoint(p: Point2D): number {
        return p.copy.sub(this).length;
    }

    /**
     * Turns both components into their absolutes, removing signs.
     */
    abs(): Point2D {
        this.x = Math.abs(this.x);
        this.y = Math.abs(this.y);
        return this;
    }

    /**
     * Interprets point as a vector and create a new vector perpendicular.
     * (clockwise)
     */
    getPerpendicular(): Point2D {
        return new Point2D(-this.y, this.x);
    }

    projectOnLine(line: Line2D): Point2D {
        if (line.pointOnLine(this)) {
            return this.copy;
        }

        const p0 = line.n.copy.scale(line.d);
        let a = (this.x - p0.x) * line.n.x + (this.y - p0.y) * line.n.y;
        a /= line.n.x **2 + line.n.y ** 2;

        return this.copy.sub(line.n.copy.scale(a));
    }
}