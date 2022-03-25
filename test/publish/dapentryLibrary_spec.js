import {describe, it} from "mocha";
import {expect} from "chai"
import {
    circleCenterPoint,
    circleCenterRadius,
    circlePointPoint,
    linePointPoint,
    linePointVectorLength,
    rectangleBottomLeft,
    rectangleBottomRight,
    rectangleCenter,
    rectanglePointPoint,
    rectangleTopLeft,
    rectangleTopRight,
    scaleObject,
    scaleObjectUniform,
    scaleObjectToPoint, scaleObjectToPointUniform
} from "../../src/publish/operationHelpers";
import {GrRectangle} from "../../src/geometry/GrRectangle";


describe('dapentry library', () => {

    describe('provides functions to create circles', () => {

        it("creating a circle with center and radius", () => {
            const c = circleCenterRadius("c1", 100, 100, 30);

            expect(c.uniqueName).to.equal("c1");
            expect(c.center).to.deep.equal({x: 100, y: 100});
            expect(c.radius).to.equal(30);
        });

        it("creating a circle with a center to a point", () => {
            const c = circleCenterPoint("c2", 100, 100, 100, 200);
            expect(c.uniqueName).to.equal("c2");
            expect(c.center).to.deep.equal({x: 100, y: 100});
            expect(c.radius).to.equal(100);
        });

        it("creating a circle from point to point", () => {
            const c = circlePointPoint("c2", 100, 100, 100, 200);
            expect(c.uniqueName).to.equal("c2");
            expect(c.center).to.deep.equal({x: 100, y: 150});
            expect(c.radius).to.equal(50);
        });
    });

    describe('provides functions to create rectangles', () => {

        it("creating a rectangle from point to point", () => {
            const r1 = rectanglePointPoint("r1", 100, 100, 200, 300);
            expect(r1.uniqueName).to.equal("r1");
            expect(r1.center).to.deep.equal({x: 150, y: 200});
            expect(r1.width).to.equal(100);
            expect(r1.height).to.equal(200);

            const r2 = rectanglePointPoint("r2", 200, 300, 100, 100);
            expect(r2.uniqueName).to.equal("r2");
            expect(r2.center).to.deep.equal({x: 150, y: 200});
            expect(r2.width).to.equal(100);
            expect(r2.height).to.equal(200);
        });

        it("creating a rectangle from top left", () => {
            const r = rectangleTopLeft("r", 100, 100, 20, 300);
            expect(r.uniqueName).to.equal("r");
            expect(r.center).to.deep.equal({x: 110, y: 250});
            expect(r.width).to.equal(20);
            expect(r.height).to.equal(300);
        });

        it("creating a rectangle from bottom left", () => {
            const r = rectangleBottomLeft("r", 100, 100, 20, 300);
            expect(r.uniqueName).to.equal("r");
            expect(r.center).to.deep.equal({x: 110, y: -50});
            expect(r.width).to.equal(20);
            expect(r.height).to.equal(300);
        });

        it("creating a rectangle from bottom right", () => {
            const r = rectangleBottomRight("r", 100, 100, 20, 300);
            expect(r.uniqueName).to.equal("r");
            expect(r.center).to.deep.equal({x: 90, y: -50});
            expect(r.width).to.equal(20);
            expect(r.height).to.equal(300);
        });

        it("creating a rectangle from top right", () => {
            const r = rectangleTopRight("r", 100, 100, 20, 300);
            expect(r.uniqueName).to.equal("r");
            expect(r.center).to.deep.equal({x: 90, y: 250});
            expect(r.width).to.equal(20);
            expect(r.height).to.equal(300);
        });

        it("creating a rectangle from center with width and height", () => {
            const r = rectangleCenter("r", 100, 100, 20, 300);
            expect(r.uniqueName).to.equal("r");
            expect(r.center).to.deep.equal({x: 100, y: 100});
            expect(r.width).to.equal(20);
            expect(r.height).to.equal(300);
        });
    });

    describe('provides functions to create lines', () => {

        it('creates a line from point to point', () => {
            const l = linePointPoint("l", 100, 100, 200, 150);
            expect(l.uniqueName).to.equal("l");
            expect(l.start).to.deep.equal({x: 100, y: 100});
            expect(l.end).to.deep.equal({x: 200, y: 150});
        });

        it('creates a line from point with a vector and a length', () => {
            const l = linePointVectorLength("l", 100, 100, 1, 0.5, 100);
            expect(l.uniqueName).to.equal("l");
            expect(l.start).to.deep.equal({x: 100, y: 100});
            expect(l.end).to.deep.equal({x: 200, y: 150});
        });
    });

    describe("provides functions for scaling", () => {
       it("scale by factors", () => {
            const r = new GrRectangle("r", 100, 100, 100, 150);

            expect(r.bottom).to.deep.equal({ x: 100, y: 175 })

            scaleObject(r, 0.5, 0.3, r.bottom.x, r.bottom.y);

            expect(r.width).to.equal(50);
            expect(r.height).to.equal(45);

            expect(r.bottom).to.deep.equal({ x: 100, y: 175 })
            expect(r.top).to.deep.equal({ x: 100, y: 130 })
       });

       it("scale by factors uniformly", () => {
            const r = new GrRectangle("r", 100, 100, 100, 150);

            expect(r.bottom).to.deep.equal({ x: 100, y: 175 })

            scaleObjectUniform(r, 0.5, r.bottom.x, r.bottom.y);

            expect(r.width).to.equal(50);
            expect(r.height).to.equal(75);

            expect(r.bottom).to.deep.equal({ x: 100, y: 175 })
            expect(r.top).to.deep.equal({ x: 100, y: 100 })
       });

       it("scale to a point", () => {
            const r = new GrRectangle("r", 100, 100, 100, 150);

            scaleObjectToPoint(r, r.top.x, r.top.y, r.top.x, 0, r.bottom.x, r.bottom.y);

            expect(r.width).to.equal(100);
            expect(r.height).to.equal(175);

            expect(r.bottom).to.deep.equal({ x: 100, y: 175 })
            expect(r.top).to.deep.equal({ x: 100, y: 0 })
       });

       it("scale to a point uniformly", () => {
            const r = new GrRectangle("r", 100, 100, 100, 150);

            scaleObjectToPointUniform(r, r.top.x, r.top.y, r.top.x, 0, r.bottom.x, r.bottom.y);

            expect(r.width).to.equal(100 * 175 / 150);
            expect(r.height).to.equal(175);

            expect(r.bottom).to.deep.equal({ x: 100, y: 175 })
            expect(r.top).to.deep.equal({ x: 100, y: 0 })
       });
    });
});