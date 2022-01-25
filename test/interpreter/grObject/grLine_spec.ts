import {describe, it} from "mocha";
import {expect} from "chai"
import {GrLine} from "../../../src/Geo/GrLine";
import {eq} from "../../../src/Geo/GeoMath";
import {POI} from "../../../src/Geo/GrObject";

function eqp(p1, p2) {
    return eq(p1.x, p2.x) && eq(p1.y, p2.y);
}

describe('GrLIne', () => {

    it("point at percentage", () => {
        let l = GrLine.create(null, 0, 0, 100, 100);
        let p;

        p = l.getPointAtPercentage(0.5);
        expect(p.x).to.equal(50);
        expect(p.y).to.equal(50);

        p = l.getPointAtPercentage(0.25);
        expect(p.x).to.equal(25);
        expect(p.y).to.equal(25);

        p = l.getPointAtPercentage(0.75);
        expect(p.x).to.equal(75);
        expect(p.y).to.equal(75);


        l = GrLine.create(null, 0, 0, 77, 0);
        p = l.getPointAtPercentage(0.25);
        expect(p.x).to.equal(77 / 4);
        expect(p.y).to.equal(0);
    })

    it("rotate", () => {

        let l = GrLine.create(null, -10, 0, 10, 0);

        l.rotate(90);

        console.log(l.start)
        console.log(l.end)
        expect(eqp(l.start, { x: 0, y: -10})).to.be.true;
        expect(eqp(l.end, { x: 0, y: 10})).to.be.true;


        l = GrLine.create(null, -10, 0, 10, 0);

        l.rotate(90, l.start);
        console.log(l.start)
        console.log(l.end)

        l = GrLine.create(null, -10, 0, 10, 0);

        for (let i = 0; i < 180; i++)
            l.rotatePOI(POI.end, 0.5);
        console.log(l.start)
        console.log(l.end)


        l.rotate(90);

    });

});