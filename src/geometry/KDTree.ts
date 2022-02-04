import {Point2D} from "./Point2D";


interface TreeNode {
    location: Point2D,
    left: TreeNode,
    right: TreeNode
}

/**
 * K-D-Tree
 * This can be used to make quick nearest neighbour queries on a list of
 * points.
 * https://en.wikipedia.org/wiki/K-d_tree
 * https://www.youtube.com/watch?v=BK5x7IUTIyU
 *
 * This has no insert atm. So you need to rebuild the whole tree everytime the
 * list of points changes
 *
 */
export class KDTree {
    private readonly _axisAccessors: Array<string>;
    private readonly _node: TreeNode;

    constructor(axisAccessors: Array<string>, points: Array<Point2D>) {
        this._axisAccessors = axisAccessors;
        this._node = this.constructFromPoints(points);
    }

    get root(): TreeNode {
        return this._node;
    }

    print() {

        const printNode = (node) => {
            if (!node) {
                return;
            }
            console.group(node.location)
            printNode(node.left);
            printNode(node.right);
            console.groupEnd();
        }

        printNode(this._node);

    }

    protected getAxisForDepth(depth: number): string {
        return this._axisAccessors[depth % this._axisAccessors.length];
    }

    protected constructFromPoints(points: Array<Point2D>, depth: number = 0): TreeNode {

        if (!points || !points.length) {
            return null;
        }
        if (points.length === 1) {
            return {
                location: points[0],
                left: null,
                right: null
            }
        }

        const axis = this.getAxisForDepth(depth);
        const medianIndex = Math.floor(points.length / 2);
        points.sort((a, b) => a[axis] - b[axis]);

        const forLeft = points.filter((p, i) => i < medianIndex);
        const forRight = points.filter((p, i) => i >= medianIndex);

        return {
            location: points[medianIndex],
            left: this.constructFromPoints(forLeft, depth + 1),
            right: this.constructFromPoints(forRight, depth + 1)
        };
    }


    protected searchDown(point: Point2D, node: TreeNode, depth: number): Array<Point2D> {

        if (!node.left || !node.right) {
            return [node.location];
        }

        const axis = this.getAxisForDepth(depth);

        const p = point[axis];
        const n = node.location[axis];

        let best;
        let otherSide;
        if (p < n) {
            best = this.searchDown(point, node.left, depth + 1);
            otherSide = node.right;
        } else {
            best = this.searchDown(point, node.right, depth + 1);
            otherSide = node.left;
        }

        const bestDist = best[0].distanceSquared(point);
        let otherDist = (best[0][axis] - node.location[axis]) ** 2;
        if (otherDist < bestDist) {
            const otherBest = this.searchDown(point, otherSide, depth + 1);
            const otherDist = otherBest[0].distanceSquared(point);

            if (otherDist === bestDist) {
                best.push(...otherBest);
            }

            if (otherDist < bestDist) {
                return otherBest
            }
        }

        return best;
    }

    public getNearestNeighbor(point: Point2D): Array<Point2D> {
        return this.searchDown(point, this._node, 0);
    }
}