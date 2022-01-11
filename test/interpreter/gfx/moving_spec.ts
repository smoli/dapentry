import {describe, it} from "mocha";
import {expect} from "chai"
import {GfxInterpreter} from "../../../src/GfxInterpreter";
import {StyleManager} from "../../../src/controls/drawing/Objects/StyleManager";


describe('Moving', () => {

    async function runCode(code:string):Promise<GfxInterpreter> {
        const styles = new StyleManager();
        let interpreter:GfxInterpreter = new GfxInterpreter();

        interpreter.parse(code);
        interpreter.clearObjects();
        await interpreter.run({
            "$styles": styles.styles,
            "$lastObject": null,
        });

        return interpreter;
    }


    describe("a circle", () => {

        it("will move the whole circle, no matter what point is moved", async () => {
            const code = `
                CIRCLE Circle1, $styles.default, (100, 100), 50
                MOVE Circle1, "center", ( 50, 50 )
                CIRCLE Circle2, $styles.default, (200, 200), 50
                MOVE Circle2, "top", Circle1, "bottom"
            `;

            const i = await runCode(code);

            expect(i.getRegister("Circle1").center).to.deep.equal({
                x: 150, y: 150
            });
            expect(i.getRegister("Circle2").center).to.deep.equal({
                x: 150, y: 250
            });
        });

    });

    describe("a line", () => {

        it('will move the end of a line individually', async () => {

            const code = `
                LINE Line1, $styles.default, (0, 0), (100, 0)
                LINE Line2, $styles.default, (0, 0), (100, 0)
                CIRCLE Circle2, $styles.default, (100, 100), 50
                MOVE Line1, "end", Circle2, "top"
                MOVE Line2, "start", Circle2, 0.25
            `;

            const i = await runCode(code);

            expect(i.getRegister("Line1").end).to.deep.equal({
                x: 100, y: 50
            });
            expect(i.getRegister("Line2").start).to.deep.equal({
                x: 150, y: 100
            });
        });

    })
});