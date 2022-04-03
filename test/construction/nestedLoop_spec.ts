import {describe, it} from "mocha";
import {expect} from "chai"
import {runCode} from "../testHelpers/toolRunCode";
import {GrObjectList} from "../../src/geometry/GrObjectList";
import {GrPolygon} from "../../src/geometry/GrPolygon";
import {ObjectType} from "../../src/geometry/GrObject";


describe('Loops', () => {

    it("creates a list of objects when creating the same object name", async () => {

        const code = `
            LOAD x, [10, 20, 30]
            FOREACH x
                RECT Rectangle1, $styles.default, (x, 100), 100, 50                
            ENDEACH
        `;

        const i = await runCode(code);

        const rects = i.getRegister("Rectangle1");

        expect(rects).to.be.instanceof(GrObjectList);
        expect(rects.objects.length).to.equal(3);
        expect(rects.objects[0].center).to.deep.equal({ x: 10, y: 100 });
        expect(rects.objects[1].center).to.deep.equal({ x: 20, y: 100 });
        expect(rects.objects[2].center).to.deep.equal({ x: 30, y: 100 });
    })


    it('can be used', async () => {

        const code = `
            DO 3
                DO 3
                    RECT Rectangle1, $styles.default, (100, 100), 100, 50
                    MOVE Rectangle1@bottom, Rectangle1@top
                ENDDO
            ENDDO
        `;

        const i = await runCode(code);

        const rects = i.getRegister("Rectangle1");

        expect(rects).to.be.instanceof(GrObjectList);
        expect(rects.objects.length).to.equal(9);
        expect(rects.objects[0].center).to.deep.equal({ x: 100, y: 50 });
        expect(rects.objects[1].center).to.deep.equal({ x: 100, y: 0 });
        expect(rects.objects[2].center).to.deep.equal({ x: 100, y: -50 });
        expect(rects.objects[3].center).to.deep.equal({ x: 100, y: 50 });
        expect(rects.objects[4].center).to.deep.equal({ x: 100, y: 0 });
        expect(rects.objects[5].center).to.deep.equal({ x: 100, y: -50 });
        expect(rects.objects[6].center).to.deep.equal({ x: 100, y: 50 });
        expect(rects.objects[7].center).to.deep.equal({ x: 100, y: 0 });
        expect(rects.objects[8].center).to.deep.equal({ x: 100, y: -50 });
    });

    it("can be used with polygons", async () => {
        const code = `
            LOAD x, [10, 20, 30]
            LOAD y, [30, 20, 10]
            FOREACH x
                FOREACH y                   
                    POLY Polygon1, $styles.default, [ (x, y) ], 1
                ENDEACH
            ENDEACH
        `;

        const i = await runCode(code);

        const object = i.getRegister("Polygon1");
        expect(object).to.be.instanceof(GrObjectList);
        expect(object.objects.length).to.equal(3);
        expect(object.objects[0].points).to.deep.equal([
            { x: 10, y: 30 },
            { x: 10, y: 20 },
            { x: 10, y: 10 }
        ]);
        expect(object.objects[1].points).to.deep.equal([
            { x: 20, y: 30 },
            { x: 20, y: 20 },
            { x: 20, y: 10 }
        ]);
        expect(object.objects[2].points).to.deep.equal([
            { x: 30, y: 30 },
            { x: 30, y: 20 },
            { x: 30, y: 10 }
        ]);

        expect(i.objects.find(o => o.uniqueName === "Polygon1")).to.equal(object);
    })
});