import {describe, it} from "mocha";
import {expect} from "chai"
import {deg2rad, eq} from "../src/Geo/GeoMath"
import {Line2D} from "../src/Geo/Line2D";
import {Point2D} from "../src/Geo/Point2D";


function eqp(p1, p2) {
    return eq(p1.x, p2.x) && eq(p1.y, p2.y);
}

describe('Geometry functions', () => {

    it('equality checks provide a means to check for equality with a margin of error', () => {
        expect(eq(100, 100.000000000003)).to.be.true;
    });

    describe("Point", () => {
        it("can be rotated", () => {
            let p = new Point2D(0, 100);
            p.rotate(deg2rad(90));

            expect(eqp(p, { x: -100, y: 0})).to.be.true;

            p = new Point2D(0, 100);

            p.rotate(deg2rad(90), new Point2D(0, 50));

            expect(eqp(p, { x: -50, y: 50})).to.be.true;

        });
    });

    describe("Line", () => {

        it("can be created", () => {
            expect(() => {
                new Line2D(new Point2D(0, 1), 0);
            }).not.to.throw;

            const l = new Line2D(new Point2D(0, 1), 0);
            expect(l.n).to.deep.equal({x: 0, y: 1});
        });

        it("can determine if a point lies on it", () => {
            const l = new Line2D(new Point2D(0, 1), 0);
            expect(l.pointOnLine(new Point2D(100, 0))).to.be.true;
            expect(l.pointOnLine(new Point2D(100, 1))).to.be.false;

            const l2 = Line2D.createPP(new Point2D(0, 0), new Point2D(1, 0));
            expect(l2.pointOnLine(new Point2D(100, 0))).to.be.true;
            expect(l2.pointOnLine(new Point2D(100, 1))).to.be.false;
        });

        it("can project a point on itself", () => {
            const l1 = Line2D.createPP(new Point2D(0, 0), new Point2D(1, 0));

            expect(l1.projectPoint(new Point2D(20, 20))).to.deep.equal({x: 20, y: 0})

            const l2 = Line2D.createPP(new Point2D(0, 0), new Point2D(2, 1));
            const p2 = l2.projectPoint(new Point2D(0, 25));

            console.log(p2)
            expect(l2.pointOnLine(p2)).to.be.true;
        });

        it("can intersect with another line", () => {
            const l1 = Line2D.createPP(new Point2D(0, 0), new Point2D(1, 3));
            const l2 = Line2D.createPP(new Point2D(0, 0), new Point2D(2, 1));

            let p = l1.intersectLine(l2);

            expect(l1.pointOnLine(p)).to.be.true;
            expect(l2.pointOnLine(p)).to.be.true;


            const l3 = Line2D.createPP(new Point2D(10, 0), new Point2D(1, 0));
            const l4 = Line2D.createPP(new Point2D(0, 0), new Point2D(2, 0));

            let p2 = l3.intersectLine(l4);
            expect(p2).to.be.null;

        });

    });


});