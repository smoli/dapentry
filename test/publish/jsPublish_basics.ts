import {describe, it} from "mocha";
import {expect} from "chai"
import {
    getNumberFromToken,
    getOpCode,
    getVariableName,
    getXYFromToken,
    JSPublisher
} from "../../src/publish/JSPublisher";
import {T_NUMBER, T_OPCODE, T_POINT, T_POINT_NN, T_REGISTER, T_REGISTERAT} from "../testHelpers/tokens";


describe('JS publisher', () => {

    it('takes a simple line of dapentry code and creates JS code for it', () => {
        const code = 'CIRCLECR Circle1,$styles.default,(555.79, 228.72),228.34';

        const js = JSPublisher.getRawJSCode(code);

        expect(js).to.deep.equal([
            `__objects.Circle1 = new dapentry.Circle("Circle1", 555.79, 228.72, 228.34);`,
            "__objects.Circle1.style = $styles.default;"
        ]);
    });

    describe('Helpers', () => {
        it('can determine the opcode for tokens', () => {
            expect(getOpCode([T_OPCODE("LOAD"), T_REGISTER("lkjh")])).to.equal("LOAD")
        });

        it('creates x,y parameters for point tokens', () => {
            expect(getXYFromToken(T_POINT_NN(1, 2))).to.equal("1, 2");
            expect(getXYFromToken(T_REGISTERAT("a", "b"))).to.equal("a.b.x, a.b.y");
        });

        it('get the number from a number token as a string', () => {
            expect(getNumberFromToken(T_NUMBER(12))).to.equal("12");
        });

        it("gets the variable name from a register token", () => {
            expect(getVariableName(T_REGISTER("df"))).to.equal("df");
        });
    });

    describe("exporting circle statements", () => {
        it("exports Circle from center to a point", () => {
            const code1 = `CIRCLECP Circle1,$styles.default,Canvas@center,Canvas@right`;

            let js = JSPublisher.getJSLine(code1);

            expect(js).to.deep.equal([
                `__objects.Circle1 = new dapentry.Circle("Circle1", __canvas.center.x, __canvas.center.y, dapentry.distance(__canvas.center.x, __canvas.center.y, __canvas.right.x, __canvas.right.y));`,
                "__objects.Circle1.style = $styles.default;"
            ]);

            const code2 = `CIRCLECP Circle1,$styles.default,aPoint,Canvas@right`;
            js = JSPublisher.getJSLine(code2);

            expect(js).to.deep.equal([
                `__objects.Circle1 = new dapentry.Circle("Circle1", aPoint.x, aPoint.y, dapentry.distance(aPoint.x, aPoint.y, __canvas.right.x, __canvas.right.y));`,
                "__objects.Circle1.style = $styles.default;"
            ]);
        });

        it("exports Circle from point to a point", () => {
            const code = `CIRCLEPP Circle1,$styles.default,Canvas@center,Canvas@right`;

            const js = JSPublisher.getJSLine(code);

            expect(js).to.deep.equal([
                `__objects.Circle1 = new dapentry.Circle("Circle1", dapentry.midPoint(__canvas.center.x, __canvas.center.y, __canvas.right.x, __canvas.right.y), dapentry.distance(__canvas.center.x, __canvas.center.y, __canvas.right.x, __canvas.right.y));`,
                "__objects.Circle1.style = $styles.default;"
            ]);
        })
    });
});