import {describe, it} from "mocha";
import {expect} from "chai"
import {GrPolygon} from "../../src/Geo/GrPolygon";
import {Point2D} from "../../src/Geo/Point2D";
import {eqp} from "../../src/Geo/GeoMath";


describe('GrPolygon', () => {
    const stairs = [
        new Point2D(0, 0),
        new Point2D(1, 0),
        new Point2D(1, 1),
        new Point2D(2, 1),
        new Point2D(2, 2),
        new Point2D(3, 2),
        new Point2D(3, 3),
        new Point2D(4, 3)
    ];

    it('can be created', () => {
        const poly = GrPolygon.create("p", []);

        expect(poly).to.be.ok;
    });

    it("can be created with a bunch of points", () => {

        const poly = GrPolygon.create("p", stairs);

        expect(poly).to.be.ok;
        expect(poly.points).to.deep.equal(stairs)
    });

    it("can have points added to it", () => {
        const empty = GrPolygon.create("empty", []);
        empty.addPoint(new Point2D(0, 0));

        expect(empty).to.be.ok;
        expect(empty.points).to.deep.equal([new Point2D(0, 0)]);

        const full = GrPolygon.create("full", stairs);
        full.addPoint(new Point2D(4, 4));
        expect(full.points).to.deep.equal([...stairs, new Point2D(4, 4)]);
    });

    it("can be rotated", () => {
        const poly = GrPolygon.create("ro", [new Point2D(0, 0), new Point2D(10, 0)]);

        poly.rotateByDeg(90);

        expect(eqp(poly.points[0], { x: 5, y: -5})).to.be.true;
        expect(eqp(poly.points[1], { x: 5, y: 5})).to.be.true;
    })
});