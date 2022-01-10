import {describe, it} from "mocha";
import {expect} from "chai"
import {GrLine} from "../../../src/Geo/GrLine";
import exp = require("constants");


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

        let l = GrLine.create(null, -1, 0, 1, 0);

        l.rotate(45);

        console.log(l.start, l.end);

    });

});