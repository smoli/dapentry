import {describe, it} from "mocha";
import {expect} from "chai"
import {GfxInterpreter} from "../../src/core/GfxInterpreter";
import {StyleManager} from "../../src/core/StyleManager";
import {ObjectType} from "../../src/geometry/GrObject";
import {GrPolygon} from "../../src/geometry/GrPolygon";


describe('Polygon', () => {

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

    describe("Creating", () => {

        it("will extend a polygon when created in a loop", async () => {

           const code = `
            LOAD D, [10, 20, 30, 40]           
            FOREACH D
            POLY Polygon1, $styles.default, [ (D, 289.95) ], 1
            ENDEACH            
           `;

            const i = await runCode(code);

            expect(i.getRegister("Polygon1").type).to.equal(ObjectType.Polygon);
            const poly = i.getRegister("Polygon1") as GrPolygon;
            expect(poly.points.length).to.equal(4);
            expect(poly.points[0].x).to.equal(10);
            expect(poly.points[1].x).to.equal(20);
            expect(poly.points[2].x).to.equal(30);
            expect(poly.points[3].x).to.equal(40);
        });


    })
});