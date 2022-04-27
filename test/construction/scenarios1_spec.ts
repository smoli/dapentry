import {describe, it} from "mocha";
import {expect} from "chai"
import {runCode} from "../testHelpers/toolRunCode";
import {GrObjectList} from "../../src/geometry/GrObjectList";
import {ObjectType} from "../../src/geometry/GrObject";


describe('Scenarios 1', () => {

    xit('Stacking by looping and moving object on themselves', async () => {

        const code = `
            DO 3
                RECT Rectangle1, $styles.default, (100, 100), 100, 50
                MOVE Rectangle1@bottom, Rectangle1@top
            ENDDO
        `;

        const i = await runCode(code);

        const rects = i.getRegister("Rectangle1");

        expect(rects).to.be.instanceof(GrObjectList);
        expect(rects.objects.length).to.equal(3);
        expect(rects.objects[0].center).to.deep.equal({ x: 100, y: 100 });
        expect(rects.objects[1].center).to.deep.equal({ x: 100, y: 50 });
        expect(rects.objects[2].center).to.deep.equal({ x: 100, y: 0 });
    });

    it("list of ngons", async () => {
       const code = `
        LOAD corner, [3, 4, 5, 6, 7]
        LOAD width, 1 / size(corner)
        RECTPP Rectangle1,$styles.default,Canvas@topLeft,Canvas@bottomRight
        SCALE Rectangle1, width, 1, Rectangle1@left
        FOREACH $corner, corner
            LINEPP Line1,$styles.default,Rectangle1@center,Rectangle1@right
            MOVETO Rectangle1@bottomLeft,Rectangle1@bottomRight
            ROTATE Line1, -90, Line1@start
            DO $corner
                POLY Polygon1, $styles.default, [ Line1@end ], 1
                ROTATE Line1, (360 / $corner), Line1@start
            ENDDO
        ENDEACH
       `;


        const i = await runCode(code, );

        const polygons = i.getRegister("Polygon1");

        expect(polygons.type).to.equal(ObjectType.List)
        expect(polygons.objects[0].points.length).to.equal(3);
        expect(polygons.objects[1].points.length).to.equal(4);
        expect(polygons.objects[2].points.length).to.equal(5);
        expect(polygons.objects[3].points.length).to.equal(6);
        expect(polygons.objects[4].points.length).to.equal(7);

    });

});