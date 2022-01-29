import {describe, it} from "mocha";
import {expect} from "chai"
import {GrCircle} from "../../src/Geo/GrCircle";
import {eq, eqp} from "../../src/Geo/GeoMath";




describe('GrCircle', () => {

    it("provides some points of interest", () => {
        let c = GrCircle.create(null, 0, 0, 100);

        expect(c.center).to.deep.equal({ x: 0, y: 0});
        expect(c.top).to.deep.equal({ x: 0, y: -100});
        expect(c.bottom).to.deep.equal({ x: 0, y: 100});
        expect(c.left).to.deep.equal({ x: -100, y: 0});
        expect(c.right).to.deep.equal({ x: 100, y: 0});
    });

    it("rotating a circle rotates the points of interest", () => {
        let c = GrCircle.create(null, 0, 0, 100);

        c.rotateByDeg(90);

        expect(eqp(c.center, { x: 0, y: 0})).to.be.true;
        expect(eqp(c.top, { x: 100, y: 0 })).to.be.true;
        expect(eqp(c.bottom, { x: -100, y: 0 })).to.be.true;
        expect(eqp(c.left, { x: 0, y: -100 })).to.be.true;
        expect(eqp(c.right, { x: 0, y: 100 })).to.be.true;
    });

    it("point at percentage", () => {

        let c = GrCircle.create(null, 10, 10, 100);
        let p;

        p = c.getPointAtPercentage(0);
        expect(eq(p.x, 10)).to.be.ok
        expect(eq(p.y, -90)).to.be.ok

        p = c.getPointAtPercentage(0.25);
        expect(eq(p.x, 110)).to.be.ok
        expect(eq(p.y, 10)).to.be.ok

        p = c.getPointAtPercentage(0.5);
        expect(eq(p.x, 10)).to.be.ok
        expect(eq(p.y, 110)).to.be.ok

        p = c.getPointAtPercentage(0.75);
        expect(eq(p.x, -90)).to.be.ok
        expect(eq(p.y, 10)).to.be.ok

        c.rotateByDeg(90);
        p = c.getPointAtPercentage(0);
        expect(eq(p.x, 110)).to.be.ok
        expect(eq(p.y, 10)).to.be.ok


    })

});