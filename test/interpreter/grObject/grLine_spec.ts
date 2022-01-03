import {describe, it} from "mocha";
import {expect} from "chai"
import {GrLine} from "../../../src/controls/drawing/Objects/GrLine";


describe('GrLIne', () => {

    xit('defines a line in 2d space', () => {
        const l = GrLine.create("line", 9, 9, 11, 11);

        expect(l.x).to.equal(10);
        expect(l.y).to.equal(10);

        l.x2 = 12;

        expect(l.x).to.equal(21 / 2);
        expect(l.y).to.equal(10);

    });
});