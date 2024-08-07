import {describe, it} from "mocha";
import {JSPublisher} from "../../src/publish/JSPublisher";
import {expect} from "chai";

import * as library from "../../src/publish/library";
import {AspectRatio} from "../../src/publish/library";
import {GrCanvas} from "../../src/geometry/GrCanvas";
import {ObjectType} from "../../src/geometry/GrObject";
import {DataField, DataFieldType} from "../../src/state/modules/Data";

const canvas = GrCanvas.create_1_1(1000);

const libProxyHandler = {
    get(target, propkey) {
        return (...args) => {
            console.group("\nCall to " + propkey);
            args.forEach(a => console.log(a));
            const r = target[propkey].apply(target, args);

            console.log("Result: ", r, "\n");

            console.groupEnd();
            return r;
        };
    }
}

function makeDrawingFunction(jsCode:Array<string>): Function {
    return new Function("dapentry", "__canvas", ["this.__canvas = __canvas;\n", ...jsCode].join("\n"));
}

const loggingLib = new Proxy(library, libProxyHandler);

describe('A published drawing', () => {

    it('works', () => {
        const code = `RECTPP Rectangle1,$styles.default,Canvas@center,Canvas@topRight`;
        const jsCode = JSPublisher.getDrawingFunctionBody(code, [], ["Rectangle1"]);

        console.log(jsCode.join("\n"))

        const drawing = makeDrawingFunction(jsCode);

        const r = drawing(library, canvas);

        expect(r.length).to.equal(1);

        const rect:library.Rectangle = r[0];

        expect(rect.width).to.equal(500);
        expect(rect.height).to.equal(500);
        expect(rect.center).to.deep.equal({ x: 750, y: 250 });
    });

    it("works for loops as well", () => {

        const code = `
        DO 4
            RECTBL Rectangle1,$styles.default,Canvas@center,150, 100
        ENDDO
        `
        const jsCode = JSPublisher.getDrawingFunctionBody(code, [], ["Rectangle1"]);

        const drawing = makeDrawingFunction(jsCode);

        const r = drawing(library, canvas);

        expect(r.length).to.equal(1);
        expect(r[0].type).to.equal(ObjectType.List);
        expect(r[0].objects.length).to.equal(4);
    });


    it("works for loops that refer a field as well", () => {
        const code = `
        DO x
            RECTBL Rectangle1,$styles.default,Canvas@center,150, 100
        ENDDO
        `
        const jsCode = JSPublisher.getDrawingFunctionBody(code, [{
            name: "x",
            value: "7",
            type: DataFieldType.Number,
            description: "lkjh",
            published: false
        }], ["Rectangle1"]);

        const drawing = makeDrawingFunction(jsCode);

        const r = drawing(library, canvas);

        expect(r.length).to.equal(1);
        expect(r[0].type).to.equal(ObjectType.List);
        expect(r[0].objects.length).to.equal(7);
    });

    it("works for forEach that refer a list as well", () => {
        const code = `
        FOREACH x
            RECTBL Rectangle1,$styles.default,Canvas@center, x, 100
        ENDEACH
        `
        const jsCode = JSPublisher.getDrawingFunctionBody(code, [{
            name: "x",
            value: [100, 200, 300],
            type: DataFieldType.List,
            description: "lkjh",
            published: false
        }], ["Rectangle1"]);

        console.log(jsCode.join("\n"))

        const drawing = makeDrawingFunction(jsCode);

        const r = drawing(library, canvas);

        expect(r.length).to.equal(1);
        expect(r[0].type).to.equal(ObjectType.List);
        expect(r[0].objects.length).to.equal(3);

        expect(r[0].objects[0].width).to.equal(100);
        expect(r[0].objects[1].width).to.equal(200);
        expect(r[0].objects[2].width).to.equal(300);
    });

    it("can handle expression in data and steps", () => {
        const code = `
            RECTPP Rectangle3,$styles.default,Canvas@topLeft,Canvas@bottomRight
            SCALE Rectangle3, width, 1, Rectangle3@left
            FOREACH data
            RECTPP Rectangle4,$styles.default,Rectangle3@topLeft,Rectangle3@bottomRight
            SCALE Rectangle4, 1, data * ratio, Rectangle4@bottom
            MOVETO Rectangle3@bottomLeft,Rectangle3@bottomRight
            ENDEACH        
        `;

        const fields: Array<DataField> = [{
            name: "data", type: DataFieldType.List, published: false, description: "",
            value: [10, 20, 30, 40, 50]
        }, {
            name: "width", type: DataFieldType.String, published: false, description: "",
            value: "1 / size(data)"
        }, {
            name: "ratio", type: DataFieldType.String, published: false, description: "",
            value: "1 / max(data)"
        }
        ];

        const jsCode = JSPublisher.getDrawingFunctionBody(code, fields, ["Rectangle4"]);

        const drawing = makeDrawingFunction(jsCode);


        console.log(JSPublisher.getDrawingModule(code, AspectRatio.ar1_1, 1000,
            [fields[0]],
            [fields[1], fields[2]],
            ["Rectangle4"]));

        const r = drawing(library, canvas);


        expect(r.length).to.equal(1);
        expect(r[0].type).to.equal(ObjectType.List);
        expect(r[0].objects.length).to.equal(5);

        expect(r[0].objects[0].bottom.y).to.equal(1000);
        expect(r[0].objects[0].width).to.equal(200);
        expect(r[0].objects[0].height).to.equal(1000 / 50 * 10);

        expect(r[0].objects[1].bottom.y).to.equal(1000);
        expect(r[0].objects[1].width).to.equal(200);
        expect(r[0].objects[1].height).to.equal(1000 / 50 * 20);

        expect(r[0].objects[2].bottom.y).to.equal(1000);
        expect(r[0].objects[2].width).to.equal(200);
        expect(r[0].objects[2].height).to.equal(1000 / 50 * 30);

        expect(r[0].objects[3].bottom.y).to.equal(1000);
        expect(r[0].objects[3].width).to.equal(200);
        expect(r[0].objects[3].height).to.equal(1000 / 50 * 40);

        expect(r[0].objects[4].bottom.y).to.equal(1000);
        expect(r[0].objects[4].width).to.equal(200);
        expect(r[0].objects[4].height).to.equal(1000 / 50 * 50);
    });

    it("can create a polygon", () => {

        const code = `
            LINEPP Line1, $styles.default, Canvas@center, Canvas@top
            DO spokes
            POLY Polygon1, $styles.default, [Line1@end], 1
            ROTATE Line1, angle, Line1@start
            EXTPOLY Polygon1, [Line1@(spokeSize)]
            ROTATE Line1, angle, Line1@start
            ENDDO
        `;

        const fields: Array<DataField> = [{
            name: "spokes", type: DataFieldType.Number, published: false, description: "",
            value: 5
        },{
            name: "spokeSize", type: DataFieldType.Number, published: false, description: "",
            value: 0.5
        }, {
            name: "angle", type: DataFieldType.String, published: false, description: "",
            value: "180 / spokes"
        }
        ];

        const jsCode = JSPublisher.getDrawingFunctionBody(code, fields, ["Polygon1"]);

        const drawing = makeDrawingFunction(jsCode);

        const r = drawing(library, canvas);

        console.log(JSPublisher.getDrawingModule(code, AspectRatio.ar1_1, 1000,
            [fields[0], fields[1]],
            [fields[2]],
            ["Polygon1"]));

        expect(r.length).to.equal(1);
        expect(r[0].type).to.equal(ObjectType.Polygon);
    });

    it("will create a list of polygons through nested loops", () => {
        const code = `
            FOREACH x
                FOREACH y                   
                    POLY Polygon1, $styles.default, [ (x, y) ], 1
                ENDEACH
            ENDEACH
        `;

        const fields:Array<DataField> = [
            {
                name: "x",
                value: [10, 20, 30],
                type: DataFieldType.List,
                description: "",
                published: false
            },{
                name: "y",
                value: [30, 20, 10],
                type: DataFieldType.List,
                description: "",
                published: false
            }
        ];

        const jsCode = JSPublisher.getDrawingFunctionBody(code, fields, ["Polygon1"]);

        console.log(jsCode.join("\n"));

        const drawing = makeDrawingFunction(jsCode);
        const r = drawing(library, canvas);

        expect(r.length).to.equal(1);
        expect(ObjectType[r[0].type]).to.equal(ObjectType[ObjectType.List]);
        expect(r[0].objects.length).to.equal(3);
        expect(r[0].objects[0].points).to.deep.equal([
            { x: 10, y: 30 },
            { x: 10, y: 20 },
            { x: 10, y: 10 }
        ]);
        expect(r[0].objects[1].points).to.deep.equal([
            { x: 20, y: 30 },
            { x: 20, y: 20 },
            { x: 20, y: 10 }
        ]);
        expect(r[0].objects[2].points).to.deep.equal([
            { x: 30, y: 30 },
            { x: 30, y: 20 },
            { x: 30, y: 10 }
        ]);
    });

    it("will create an object list for object created in a do-loop", () => {
        const code = `
            DO 5
                LINEPP Line1, $styles.default, Canvas@center, Canvas@top
            ENDDO
        `;

        const jsCode = JSPublisher.getDrawingFunctionBody(code, [], ["Line1"]);

        console.log(jsCode.join("\n"));

        const drawing = makeDrawingFunction(jsCode);
        const r = drawing(library, canvas);

        expect(r.length).to.equal(1);
        expect(r[0].type).to.equal(ObjectType.List);

    });

    it("will not create an object list of guide objects", () => {
        const code = `
            FOREACH x
                LINEPP Line1, $styles.default, Canvas@center, Canvas@top
            ENDEACH
        `;

        const fields:Array<DataField> = [
            {
                name: "x",
                value: [10, 20, 30],
                type: DataFieldType.List,
                description: "",
                published: false
            }
        ];

        const jsCode = JSPublisher.getDrawingFunctionBody(code, fields, ["Line1"], ["Line1"]);

        console.log(jsCode.join("\n"));

        const drawing = makeDrawingFunction(jsCode);
        const r = drawing(library, canvas);

        expect(r.length).to.equal(1);
        expect(r[0].type).to.equal(ObjectType.Line);
    });
});