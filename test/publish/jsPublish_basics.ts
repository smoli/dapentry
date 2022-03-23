import {describe, it} from "mocha";
import {expect} from "chai"
import {JSPublisher} from "../../src/publish/JSPublisher";
import {AspectRatio} from "../../src/geometry/AspectRatio";


describe('JS publisher', () => {

    it('takes a simple line of dapentry code and creates JS code for it', () => {
        const code = 'CIRCLECR Circle1,$styles.default,(555.79, 228.72),228.34';

        const js = JSPublisher.getRawJSCode(code);

        expect(js).to.deep.equal([
            `__objects.Circle1 = new dapentry.Circle("Circle1", 555.79, 228.72, 228.34);`,
            `__objects.Circle1.style = $styles.default;`
        ]);

        console.log(JSPublisher.getDrawingModule(
            code, "drawing", AspectRatio.ar1_1, 1000, 1000, [], [], ["Circle1"]
        ).join("\n"))
    });
});