import {describe, it} from "mocha";
import {expect} from "chai"
import {
    circleCenterPoint,
    circleCenterRadius,
    circlePointPoint, rectangleBottomLeft, rectangleBottomRight, rectangleCenter,
    rectanglePointPoint, rectangleTopLeft, rectangleTopRight
} from "../../src/publish/creationHelpers";



describe('dapentry library', () => {

    describe('provides functions to create circles', () => {

        it("creating a circle with center and radius", () => {
            const c = circleCenterRadius("c1", 100, 100, 30);

            expect(c.uniqueName).to.equal("c1");
            expect(c.center).to.deep.equal({ x: 100, y: 100});
            expect(c.radius).to.equal(30);
        });

        it("creating a circle with a center to a point", () => {
            const c = circleCenterPoint("c2", 100, 100, 100, 200);
            expect(c.uniqueName).to.equal("c2");
            expect(c.center).to.deep.equal({ x: 100, y: 100});
            expect(c.radius).to.equal(100);
        });

        it("creating a circle from point to point", () => {
            const c = circlePointPoint("c2", 100, 100, 100, 200);
            expect(c.uniqueName).to.equal("c2");
            expect(c.center).to.deep.equal({ x: 100, y: 150});
            expect(c.radius).to.equal(50);
        });
    });

    describe('provides functions to create rectangles', () => {

        it("creating a rectangle from point to point", () => {
            const r1 = rectanglePointPoint("r1", 100, 100, 200, 300);
            expect(r1.uniqueName).to.equal("r1");
            expect(r1.center).to.deep.equal({ x: 150, y: 200});
            expect(r1.width).to.equal(100);
            expect(r1.height).to.equal(200);

            const r2 = rectanglePointPoint("r2", 200, 300, 100, 100);
            expect(r2.uniqueName).to.equal("r2");
            expect(r2.center).to.deep.equal({ x: 150, y: 200});
            expect(r2.width).to.equal(100);
            expect(r2.height).to.equal(200);
        });

        it("creating a rectangle from top left", () => {
            const r = rectangleTopLeft("r", 100, 100, 20, 300);
            expect(r.uniqueName).to.equal("r");
            expect(r.center).to.deep.equal({ x: 110, y: 250});
            expect(r.width).to.equal(20);
            expect(r.height).to.equal(300);
        });

        it("creating a rectangle from bottom left", () => {
            const r = rectangleBottomLeft("r", 100, 100, 20, 300);
            expect(r.uniqueName).to.equal("r");
            expect(r.center).to.deep.equal({ x: 110, y: -50});
            expect(r.width).to.equal(20);
            expect(r.height).to.equal(300);
        });

        it("creating a rectangle from bottom right", () => {
            const r = rectangleBottomRight("r", 100, 100, 20, 300);
            expect(r.uniqueName).to.equal("r");
            expect(r.center).to.deep.equal({ x: 90, y: -50});
            expect(r.width).to.equal(20);
            expect(r.height).to.equal(300);
        });

        it("creating a rectangle from top right", () => {
            const r = rectangleTopRight("r", 100, 100, 20, 300);
            expect(r.uniqueName).to.equal("r");
            expect(r.center).to.deep.equal({ x: 90, y: 250});
            expect(r.width).to.equal(20);
            expect(r.height).to.equal(300);
        });

        it("creating a rectangle from center with width and height", () => {
            const r = rectangleCenter("r", 100, 100, 20, 300);
            expect(r.uniqueName).to.equal("r");
            expect(r.center).to.deep.equal({ x: 100, y: 100});
            expect(r.width).to.equal(20);
            expect(r.height).to.equal(300);
        });

    });
});