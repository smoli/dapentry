import {describe, it} from "mocha";
import {expect} from "chai"
import {Point2D} from "../src/Geo/Point2D";
import {KDTree} from "../src/Geo/KDTree";


describe('KDTree', () => {

    function getClosestBruteForce(point: Point2D, points: Array<Point2D>):Point2D {
        return points.map(p => {
            return {
                dist: (p.x - point.x) ** 2 + (p.y - point.y) ** 2,
                p
            }
        }).sort((a, b) => a.dist - b.dist).shift().p
    }


    it('can be created for 2d Points', () => {
        const points = [
            new Point2D(0, 0),
            new Point2D(-10, 0),
            new Point2D(-10, 10),
            new Point2D(10, 10),
            new Point2D(320, 1012),
            new Point2D(321, 102.234234),
        ]

        const tree = new KDTree(["x", "y"], points);

        [
            new Point2D(0, 0),
            new Point2D(1, 1),
            new Point2D(-1, 1),
            new Point2D(100, 0),
            new Point2D(200, 10),
            new Point2D(200, 1000),
            new Point2D(200, 100),
            new Point2D(200, -100)
        ].forEach((p, i) => {
            const actual = tree.getNearestNeighbor(p);
            const expected = getClosestBruteForce(p, points);
            expect(actual).to.deep.equal(expected, "Test " + i);
        })
    });
});