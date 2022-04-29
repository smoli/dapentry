import {describe, it} from "mocha";
import {expect} from "chai"
import {
    getExpressionFromToken,
    getObjectVariable,
    getOpCode,
    getPoiFromRegisterAt,
    getVariableName,
    getXYFromToken,
    JSPublisher
} from "../../src/publish/JSPublisher";
import {T_EXPRESSION, T_NUMBER, T_OPCODE, T_POINT_NN, T_REGISTER, T_REGISTERAT} from "../testHelpers/tokens";
import {POI} from "../../src/geometry/GrObject";
import {DataField, DataFieldType} from "../../src/state/modules/Data";


describe('JS publisher', () => {

    it('takes a simple line of dapentry code and creates JS code for it', () => {
        const code = 'CIRCLECR Circle1,$styles.default,(100, 100),75';

        const js = JSPublisher.getRawJSCode(code);

        expect(js).to.deep.equal([
            `__objects("Circle1", dapentry.circleCenterRadius("Circle1", 100, 100, 75));`,
            `__objects("Circle1").style = dapentry.$styles.default;`
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
            expect(getExpressionFromToken(T_NUMBER(12))).to.equal("12");
        });

        it('gets the expression from an expression token', () => {
            expect(getExpressionFromToken(T_EXPRESSION(
                T_REGISTER("v1"), "+", T_NUMBER("12")
            ))).to.equal("(v1 + 12)");
        })

        it("gets the variable name from a register token", () => {
            expect(getVariableName(T_REGISTER("df"))).to.equal("df");
        });

        it("get object reference from a register", () => {
           expect(getObjectVariable(T_REGISTER("ob"))).to.equal(`__objects("ob")`);
        });

        it("get object reference from an at-register", () => {
           expect(getObjectVariable(T_REGISTERAT("ob", "center"))).to.equal(`__objects("ob")`);
        });

        it("get poi id from register at", () => {
            expect(getPoiFromRegisterAt(T_REGISTERAT("ob", "center"))).to.equal(POI.center);
        });

        it("export js expression on fields with expression value", () => {
            const f1:DataField = {
                name: "f1",
                type: DataFieldType.Number,
                value: "1 / max(a)",
                published: false,
                description: ""
            };

            expect(JSPublisher.getCodeForField(f1)).to.equal("f1 = 1 / dapentry.max(a)");

            const f2:DataField = {
                name: "f1",
                type: DataFieldType.String,
                value: "1 / max(a)",
                published: false,
                description: ""
            };

            expect(JSPublisher.getCodeForField(f1)).to.equal("f1 = 1 / dapentry.max(a)");
        })
    });

    describe("exporting circle statements", () => {
        it("exports Circle from center to a point", () => {
            const code1 = `CIRCLECP Circle1,$styles.default,Canvas@center,Canvas@right`;

            let js = JSPublisher.getJSLine(code1);

            expect(js).to.deep.equal([
                `__objects("Circle1", dapentry.circleCenterPoint("Circle1", this.__canvas.center.x, this.__canvas.center.y, this.__canvas.right.x, this.__canvas.right.y));`,
                `__objects("Circle1").style = dapentry.$styles.default;`
            ]);

            const code2 = `CIRCLECP Circle1,$styles.default,aPoint,Canvas@right`;
            js = JSPublisher.getJSLine(code2);

            expect(js).to.deep.equal([
                `__objects("Circle1", dapentry.circleCenterPoint("Circle1", aPoint.x, aPoint.y, this.__canvas.right.x, this.__canvas.right.y));`,
                `__objects("Circle1").style = dapentry.$styles.default;`
            ]);
        });

        it("exports Circle from point to a point", () => {
            const code = `CIRCLEPP Circle1,$styles.default,Canvas@center,Canvas@right`;

            const js = JSPublisher.getJSLine(code);

            expect(js).to.deep.equal([
                `__objects("Circle1", dapentry.circlePointPoint("Circle1", this.__canvas.center.x, this.__canvas.center.y, this.__canvas.right.x, this.__canvas.right.y));`,
                `__objects("Circle1").style = dapentry.$styles.default;`
            ]);
        })
    });

    describe("exporting rectangle statements", () => {

        it("exports from top left, width, height", () => {
            const code = `RECTTL Rectangle1,$styles.default,(100, 100),200,80`;
            const js = JSPublisher.getJSLine(code);

            expect(js).to.deep.equal([
                `__objects("Rectangle1", dapentry.rectangleTopLeft("Rectangle1", 100, 100, 200, 80));`,
                `__objects("Rectangle1").style = dapentry.$styles.default;`
            ]);
        });

        it("exports from bottom left, width, height", () => {
            const code = `RECTBL Rectangle1,$styles.default,(100, 100),200,80`;
            const js = JSPublisher.getJSLine(code);

            expect(js).to.deep.equal([
                `__objects("Rectangle1", dapentry.rectangleBottomLeft("Rectangle1", 100, 100, 200, 80));`,
                `__objects("Rectangle1").style = dapentry.$styles.default;`
            ]);
        });

        it("exports from bottom right, width, height", () => {
            const code = `RECTBR Rectangle1,$styles.default,(100, 100),200,80`;
            const js = JSPublisher.getJSLine(code);

            expect(js).to.deep.equal([
                `__objects("Rectangle1", dapentry.rectangleBottomRight("Rectangle1", 100, 100, 200, 80));`,
                `__objects("Rectangle1").style = dapentry.$styles.default;`
            ]);
        });

        it("exports from bottom right, width, height", () => {
            const code = `RECTTR Rectangle1,$styles.default,(100, 100),200,80`;
            const js = JSPublisher.getJSLine(code);

            expect(js).to.deep.equal([
                `__objects("Rectangle1", dapentry.rectangleTopRight("Rectangle1", 100, 100, 200, 80));`,
                `__objects("Rectangle1").style = dapentry.$styles.default;`
            ]);
        });

        it("exports from bottom point to point", () => {
            const code = `RECTPP Rectangle1,$styles.default,Canvas@center,Canvas@topRight`;
            const js = JSPublisher.getJSLine(code);

            expect(js).to.deep.equal([
                `__objects("Rectangle1", dapentry.rectanglePointPoint("Rectangle1", this.__canvas.center.x, this.__canvas.center.y, this.__canvas.topRight.x, this.__canvas.topRight.y));`,
                `__objects("Rectangle1").style = dapentry.$styles.default;`
            ]);
        });
    });

    describe("exporting rectangle statements", () => {
        it('exports from point to point', () => {
            const code1 = `LINEPP Line1,$styles.default,Canvas@left,(100, 600)`;
            let js = JSPublisher.getJSLine(code1);

            expect(js).to.deep.equal([
                `__objects("Line1", dapentry.linePointPoint("Line1", this.__canvas.left.x, this.__canvas.left.y, 100, 600));`,
                `__objects("Line1").style = dapentry.$styles.default;`
            ]);

            const code2 = `LINEPP Line2,$styles.default,Canvas@left,Line1@end`;
            js = JSPublisher.getJSLine(code2);

            // the second point is exported as __objects("Line1".end... because we created the Line1 in this test before.
            // The publisher then registers the name Line1 as an object. If we do not publish the first line of code through
            // the publisher the second point would only be Line1.end...
            expect(js).to.deep.equal([
                `__objects("Line2", dapentry.linePointPoint("Line2", this.__canvas.left.x, this.__canvas.left.y, __objects("Line1").end.x, __objects("Line1").end.y));`,
                `__objects("Line2").style = dapentry.$styles.default;`
            ]);
        });
    });

    describe("exports polygon statements", () => {
       it("creates a polygon", () => {
            const code = `POLY Polygon1, $styles.default, [ (300, 230), (750, 180), (970, 430), (640, 690) ], 1`
           let js = JSPublisher.getJSLine(code);

            expect(js).to.deep.equal([
                `if (__objects("Polygon1", null, false)) {`,
                `\tdapentry.extendPolygon(__objects("Polygon1"), [ { x: 300, y: 230 }, { x: 750, y: 180 }, { x: 970, y: 430 }, { x: 640, y: 690 } ]);`,
                `} else {`,
                `\t__objects("Polygon1", dapentry.polygon("Polygon1", __objects("Polygon1", null, false), true, [ { x: 300, y: 230 }, { x: 750, y: 180 }, { x: 970, y: 430 }, { x: 640, y: 690 } ]));`,
                `\t__objects("Polygon1").style = dapentry.$styles.default;`,
                `}`
            ])
       });
    });

    describe("exports text statements", () => {
       it("creates a text", () => {
            const code = `TEXT Text2,$styles.textDefault,(500, 300), "Hello World"`;

            const js = JSPublisher.getJSLine(code);

            expect(js).to.deep.equal([
                `__objects("Text2", dapentry.text("Text2", 500, 300, "Hello World"));`,
                `__objects("Text2").style = dapentry.$styles.textDefault;`
            ]);
       });
    });

    describe("scaling statements", () => {
        it("exports scaling by factors", () => {
            const code = `SCALE Rectangle1, 1.5, 1, Rectangle1@bottomLeft`;
            let js = JSPublisher.getJSLine(code);

            expect(js).to.deep.equal([
                `dapentry.scaleObject(__objects("Rectangle1"), 1.5, 1, __objects("Rectangle1").bottomLeft.x, __objects("Rectangle1").bottomLeft.y);`
            ]);
        });

        it("exports scaling to a point", () => {
            const code = `SCALEP Rectangle1, Rectangle1@top, Canvas@top, Rectangle1@bottom`;
            let js = JSPublisher.getJSLine(code);

            expect(js).to.deep.equal([
                `dapentry.scaleObjectToPoint(__objects("Rectangle1"), __objects("Rectangle1").top.x, __objects("Rectangle1").top.y, this.__canvas.top.x, this.__canvas.top.y, __objects("Rectangle1").bottom.x, __objects("Rectangle1").bottom.y);`
            ]);
        });
    });

    describe("moving statements", () => {
       it("exports move by", () => {
          const code = `MOVEBY Rectangle1@center,(170, 179)`;
          let js = JSPublisher.getJSLine(code);

          expect(js).to.deep.equal([
             `dapentry.moveObject(__objects("Rectangle1"), ${POI.center}, 170, 179);`
          ]);
       });

       it("exports move to point", () => {
          const code = `MOVETO Rectangle1@bottomRight,Canvas@center`;
          let js = JSPublisher.getJSLine(code);

          expect(js).to.deep.equal([
             `dapentry.moveObjectToPoint(__objects("Rectangle1"), ${POI.bottomRight}, this.__canvas, ${POI.center});`
          ]);

       });
    });

    describe("rotate statements", () => {
        it("exports rotate by degrees", () => {
            const code = `ROTATE Rectangle1, 45, Rectangle1@center`;
            let js = JSPublisher.getJSLine(code);

            expect(js).to.deep.equal([
                'dapentry.rotateObject(__objects("Rectangle1"), 45, __objects("Rectangle1").center.x, __objects("Rectangle1").center.y);'
            ]);
        })
    });

    describe("style statements", () => {
/*
FILL Circle1, "#340f8a"
OPACITY Circle1, 1
STROKE Circle1, "#570f48"
STROKEWIDTH Circle1, "79"
 */
       it("exports fill color", () => {
           const code = `FILL Circle1, "#340f8a"`;
           let js = JSPublisher.getJSLine(code);

           expect(js).to.deep.equal([
               '__objects("Circle1").style.fillColor = "#340f8a";'
           ]);
       });

       it("exports fill opacity", () => {
           const code = `OPACITY Circle1, 0.1`;
           let js = JSPublisher.getJSLine(code);

           expect(js).to.deep.equal([
               '__objects("Circle1").style.fillOpacity = 0.1;'
           ]);
       });

       it("exports stroke color", () => {
           const code = `STROKE Circle1, "#570f48"`;
           let js = JSPublisher.getJSLine(code);

           expect(js).to.deep.equal([
               '__objects("Circle1").style.strokeColor = "#570f48";'
           ]);
       });

       it("exports stroke width", () => {
           const code = `STROKEWIDTH Circle1, 79`;
           let js = JSPublisher.getJSLine(code);

           expect(js).to.deep.equal([
               '__objects("Circle1").style.strokeWidth = 79;'
           ]);
       });
    });


});