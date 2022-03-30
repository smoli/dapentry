import {describe, it} from "mocha";
import {expect} from "chai"
import {GrPolygon} from "../../src/geometry/GrPolygon";
import {Point2D} from "../../src/geometry/Point2D";
import {eq, eqp} from "../../src/geometry/GeoMath";
import {POI, POIPurpose} from "../../src/geometry/GrObject";
import exp = require("constants");


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

        poly.rotateByDeg(90, poly.center);

        expect(eqp(poly.points[0], {x: 5, y: -5})).to.be.true;
        expect(eqp(poly.points[1], {x: 5, y: 5})).to.be.true;
    });

    it("can be rotated and scaled (1)", () => {
        const poly = new GrPolygon("re", [
            new Point2D(-50, -50),
            new Point2D(50, -50),
            new Point2D(50, 50),
            new Point2D(-50, 50)
        ]);

        expect(eqp(
            poly.pointsOfInterest(POIPurpose.SCALING)[POI.bottom],
            {x: 0, y: 50})
        ).to.be.true;
        expect(eqp(
            poly.pointsOfInterest(POIPurpose.SCALING)[POI.top],
            {x: 0, y: -50})
        ).to.be.true;

        poly.rotateByDeg(45, poly.center);

        console.log(poly.pointsOfInterest(POIPurpose.SCALING)[POI.bottom]);
        expect(eqp(
            poly.pointsOfInterest(POIPurpose.SCALING)[POI.bottom],
            {x: -35.35533905, y: 35.35533905})
        ).to.be.true;

        expect(eqp(
            poly.pointsOfInterest(POIPurpose.SCALING)[POI.top],
            {x: 35.35533905, y: -35.35533905})
        ).to.be.true;

        expect(eqp(
            poly.pointsOfInterest(POIPurpose.SCALING)[POI.center],
            {x: 0, y: 0})
        ).to.be.true;


        poly.scale(1, 0.5, poly.pointsOfInterest(POIPurpose.SCALING)[POI.bottom])

        console.log(poly.pointsOfInterest(POIPurpose.SCALING)[POI.bottom]);

        expect(eqp(
            poly.pointsOfInterest(POIPurpose.SCALING)[POI.bottom],
            {x: -35.35533905, y: 35.35533905})
        ).to.be.true;

        expect(eqp(
            poly.pointsOfInterest(POIPurpose.SCALING)[POI.top],
            {x: 0, y: 0})
        ).to.be.true;

        expect(eqp(
            poly.pointsOfInterest(POIPurpose.SCALING)[POI.center],
            {x: -35.35533905 / 2, y: 35.35533905 / 2})
        ).to.be.true;

        expect(eq(poly.width, 100)).to.be.true
        expect(eq(poly.height, 50)).to.be.true;


    })

    it("can be rotated and scaled (2)", () => {
        const poly = new GrPolygon("re", [
            new Point2D(-50, -50),
            new Point2D(50, -50),
            new Point2D(50, 50),
            new Point2D(-50, 50)
        ]);
        const P = poi => poly.pointsOfInterest(POIPurpose.SCALING)[poi]

        poly.rotateByDeg(57.123423, poly.center);

        const bottom = P(POI.bottom);

        poly.scale(1, 0.5, P(POI.bottom))

        // Must not be the same instance
        expect(bottom).not.to.be.equal(P(POI.bottom))

        expect(eqp(
            P(POI.bottom),
            bottom)
        ).to.be.true;


        const dtb = P(POI.top).copy.sub(bottom).length;

        expect(eq(dtb, poly.height)).to.be.true;

        const dtlt = P(POI.top).copy
            .sub(P(POI.topLeft)).length
        const dtrt = P(POI.top).copy
            .sub(P(POI.topRight)).length

        expect(eq(dtrt, dtlt)).to.be.true;

        // Check that center is at the right place
        const ctl = P(POI.center).copy.sub(poly.yAxis.copy.scale(poly.height / 2)).sub(poly.xAxis.copy.scale(poly.width / 2));

        expect(eqp(ctl, P(POI.topLeft))).to.be.true;

        expect(eq(poly.width, 100)).to.be.true
        expect(eq(poly.height, 50)).to.be.true;


    })
});