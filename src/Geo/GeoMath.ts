export class Point2D {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    get copy():Point2D {
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
    angleTo(v2): number {
        return Math.atan2(this.y, this.x) - Math.atan2(v2.y, v2.x);
    }


}


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
