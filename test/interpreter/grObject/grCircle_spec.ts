import {describe, it} from "mocha";
import {expect} from "chai"
import {GrCircle} from "../../../src/Geo/GrCircle";
import {eq} from "../../../src/Geo/GeoMath";




describe('GrCircle', () => {

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

        c.rotate(90);
        p = c.getPointAtPercentage(0);
        expect(eq(p.x, 110)).to.be.ok
        expect(eq(p.y, 10)).to.be.ok


    })

});