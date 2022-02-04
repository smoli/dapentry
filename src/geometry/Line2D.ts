import {Point2D} from "./Point2D";
import {eq} from "./GeoMath";
import {Circle2D} from "./Circle2D";

export class Line2D {

    // Normal of the line
    public n: Point2D;

    // Distance from the origin
    public d: number;

    constructor(n: Point2D, d: number) {
        this.n = n.copy;
        this.d = d;
    }

    /**
     * Create a line from two points on the line.
     * @param p1
     * @param p2
     */
    public static createPP(p1: Point2D, p2: Point2D): Line2D {
        return Line2D.createPV(p1, p2.copy.sub(p1));
    }

    /**
     * Create a line from a point on the line and a vector
     * describing the direction of the line
     * @param pointOnLine
     * @param vector
     */
    public static createPV(pointOnLine: Point2D, vector: Point2D): Line2D {
        let nx = -(vector.y);
        let ny = vector.x;

        const s = nx * pointOnLine.x + ny * pointOnLine.y;
        const l = Math.sqrt(nx ** 2 + ny ** 2);

        if (s > 0) {
            nx /= l;
            ny /= l;
        } else {
            nx /= -l;
            ny /= -l;
        }

        let d = nx * pointOnLine.x + ny * pointOnLine.y;

        return new Line2D(new Point2D(nx, ny), d);
    }

    public pointOnLine(point: Point2D): boolean {
        return eq(point.x * this.n.x + point.y * this.n.y, this.d);
    }

    projectPoint(point: Point2D): Point2D {
        return point.projectOnLine(this);
    }

    intersectLine(line: Line2D): Point2D {
        const det = this.n.x * line.n.y - this.n.y * line.n.x;

        if (eq(det, 0)) {
            // Parallel lines
            return null;
        }

        const x = (this.d * line.n.y - line.d * this.n.y) / det;
        const y = (this.d * line.n.x - line.d * this.n.x) / det;

        return new Point2D(x, y);
    }

    intersectCircle(circle: Circle2D): Array<Point2D> {
        const dl = -(circle.o.x * this.n.x + circle.o.y * this.n.y - this.d);
        const  det = this.n.x * this.n.x + this.n.y * this.n.y;
        if (eq(det, 0)) return [];

        let sq = (circle.r ** 2) * det - dl ** 2;
        if (eq(sq, 0)) {
            // Tangent
            return  [
                new Point2D(
                    this.n.x * dl / det + circle.o.x,
                    this.n.y * dl / det + circle.o.x)
            ]
        } else if (sq > 0) {
            sq = Math.sqrt(sq);
            let x = (this.n.x * dl + this.n.y * sq) / det + circle.o.x;
            let y = (this.n.y * dl - this.n.x * sq) / det + circle.o.y;
            const p1 = new Point2D(x, y);
            x = (this.n.x * dl - this.n.y * sq) / det + circle.o.x;
            y = (this.n.y * dl + this.n.x * sq) / det + circle.o.y;
            const p2 = new Point2D(x, y);
            return [p1, p2]
        } else {
            // No intersection
            return [];
        }
    }


}