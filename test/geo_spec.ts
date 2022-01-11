import {describe, it} from "mocha";
import {expect} from "chai"
import {eq} from "../src/Geo/GeoMath"


describe('Geometry functions', () => {

    it('eqiality checks provide a means to check for equality with a margin of error', () => {
        expect(eq(100, 100.000000000003)).to.be.true;
    });

});