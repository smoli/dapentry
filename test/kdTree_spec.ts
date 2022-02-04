import {describe, it} from "mocha";
import {expect} from "chai"
import {Point2D} from "../src/geometry/Point2D";
import {KDTree} from "../src/geometry/KDTree";



describe('KDTree', () => {

    function getClosestBruteForce(point: Point2D, points: Array<Point2D>):Point2D {
        return points.map(p => {
            return {
                dist: (p.x - point.x) ** 2 + (p.y - point.y) ** 2,
                p
            }
        }).sort((a, b) => a.dist - b.dist).shift().p
    }


    it('can be used for nearest neighbour search on a list of points', () => {
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
            new Point2D(201, 10),
            new Point2D(202, 10),
            new Point2D(203, 10),
            new Point2D(204, 10),
            new Point2D(205, 10),
            new Point2D(200, 1000),
            new Point2D(200, 100),
            new Point2D(200, -100)
        ].forEach((p, i) => {
            const actual = tree.getNearestNeighbor(p);
            const expected = getClosestBruteForce(p, points);
            expect(actual.length).to.equal(1);
            expect(actual[0]).to.deep.equal(expected, "Test " + i);
        })
    });

    it('will return multiple points if they all have the same closest distance', () => {
        const points = [
            new Point2D(0, 0),
            new Point2D(-10, 0),
            new Point2D(-10, 0),
            new Point2D(-10, 10),
            new Point2D(-10, 10),
            new Point2D(-10, 10)
        ]

        const tree = new KDTree(["x", "y"], points);

        let p = tree.getNearestNeighbor(new Point2D(-9, 11));

        expect(p.length).to.equal(3);
        expect(p[0]).to.deep.equal({ x: -10, y: 10 })
        expect(p[1]).to.deep.equal({ x: -10, y: 10 })
        expect(p[2]).to.deep.equal({ x: -10, y: 10 })

        p = tree.getNearestNeighbor(new Point2D(-11, 1));
        expect(p.length).to.equal(2);
        expect(p[0]).to.deep.equal({ x: -10, y: 0 })
        expect(p[1]).to.deep.equal({ x: -10, y: 0 })

    })
});