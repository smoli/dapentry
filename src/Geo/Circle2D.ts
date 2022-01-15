import {Point2D} from "./Point2D";
import {eq} from "./GeoMath";

export class Circle2D {
    public o: Point2D;
    public r: number;

    constructor(o: Point2D, r: number) {
        this.o = o.copy;
        this.r = r;
    }

    pointOnCircle(point: Point2D): boolean {
        return eq(point.copy.sub(this.o).length, this.r)
    }

}