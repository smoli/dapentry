import {describe, it} from "mocha";
import {expect} from "chai"
import {GrRectangle} from "../../src/Geo/GrRectangle";
import {POI, POIPurpose} from "../../src/Geo/GrObject";
import {eqp} from "../../src/Geo/GeoMath";


describe('Rectangle', () => {

    it('can be rotated', () => {

        const re = new GrRectangle("r", 0, 0, 100, 100);

        expect(eqp(
            re.pointsOfInterest(POIPurpose.MANIPULATION)[POI.topRight],
            { x: 50, y: -50}
        )).to.be.true;

        re.rotateByDeg(90);
        expect(eqp(
            re.pointsOfInterest(POIPurpose.MANIPULATION)[POI.topRight],
            { x: 50, y: 50}
        )).to.be.true;
    });

    it("can be scaled around the center", () => {
       const re = new GrRectangle("r", 0, 0, 100, 100)

       re.scale(0.5, 0.80, re.pointsOfInterest(POIPurpose.MANIPULATION)[POI.center]);

       expect(eqp(
           re.pointsOfInterest(POIPurpose.MANIPULATION)[POI.center],
           { x: 0, y: 0}
       )).to.be.true;
       expect(eqp(
           re.pointsOfInterest(POIPurpose.MANIPULATION)[POI.topLeft],
           { x: -25, y: -40}
       )).to.be.true;
       expect(eqp(
           re.pointsOfInterest(POIPurpose.MANIPULATION)[POI.topRight],
           { x: 25, y: -40}
       )).to.be.true;
    });

    it("can be scaled smaller along one axis", () => {
        const re = new GrRectangle("r", 0, 0, 100, 100);

        console.log(re.pointsOfInterest(POIPurpose.MANIPULATION)[POI.top])
        expect(eqp(
            re.pointsOfInterest(POIPurpose.MANIPULATION)[POI.top],
            { x: 0, y: -50}
        )).to.be.true;

        re.scale(1, 0.5, re.pointsOfInterest(POIPurpose.MANIPULATION)[POI.bottom]);

        expect(eqp(
            re.pointsOfInterest(POIPurpose.MANIPULATION)[POI.top],
            { x: 0, y: 0}
        )).to.be.true;

        expect(eqp(
            re.pointsOfInterest(POIPurpose.MANIPULATION)[POI.bottom],
            { x: 0, y: 50}
        )).to.be.true;

        re.scale(1, 0.5, re.pointsOfInterest(POIPurpose.MANIPULATION)[POI.bottom]);
        expect(eqp(
            re.pointsOfInterest(POIPurpose.MANIPULATION)[POI.bottom],
            { x: 0, y: 50}
        )).to.be.true;
    })


    it("can be scaled larger along one axis", () => {
        const re = new GrRectangle("r", 0, 0, 100, 100);

        expect(eqp(
            re.pointsOfInterest(POIPurpose.MANIPULATION)[POI.bottom],
            { x: 0, y: 50}
        )).to.be.true;

        console.log(re.pointsOfInterest(POIPurpose.MANIPULATION)[POI.bottom])
        re.scale(1, 2, re.pointsOfInterest(POIPurpose.MANIPULATION)[POI.bottom]);

/*
        expect(eqp(
            re.pointsOfInterest(POIPurpose.MANIPULATION)[POI.top],
            { x: 0, y: -150}
        )).to.be.true;
*/
        console.log(re.pointsOfInterest(POIPurpose.MANIPULATION)[POI.bottom])
        console.log(re.pointsOfInterest(POIPurpose.MANIPULATION)[POI.center])

        expect(eqp(
            re.pointsOfInterest(POIPurpose.MANIPULATION)[POI.bottom],
            { x: 0, y: 50}
        )).to.be.true;

    })



    it('can be rotated and then scaled', () => {

        const re = new GrRectangle("r", 0, 0, 100, 100);

        re.rotateByDeg(90);
        console.log(re.pointsOfInterest(POIPurpose.MANIPULATION)[POI.topRight]);
        expect(eqp(
            re.pointsOfInterest(POIPurpose.MANIPULATION)[POI.topRight],
            { x: 50, y: 50}
        )).to.be.true;

        re.scale(0.5, 0.5, re.pointsOfInterest(POIPurpose.MANIPULATION)[POI.topRight])
        console.log(re.pointsOfInterest(POIPurpose.MANIPULATION)[POI.topRight]);

        expect(eqp(
            re.pointsOfInterest(POIPurpose.MANIPULATION)[POI.topRight],
            { x: 50, y: 50}
        )).to.be.true;

        expect(eqp(
            re.pointsOfInterest(POIPurpose.MANIPULATION)[POI.center],
            { x: 25, y: 25}
        )).to.be.true;

        expect(eqp(
            re.pointsOfInterest(POIPurpose.MANIPULATION)[POI.topRight],
            { x: 50, y: 50}
        )).to.be.true;

        expect(eqp(
            re.pointsOfInterest(POIPurpose.MANIPULATION)[POI.topLeft],
            { x: 50, y: 0}
        )).to.be.true;

        expect(eqp(
            re.pointsOfInterest(POIPurpose.MANIPULATION)[POI.bottomLeft],
            { x: 0, y: 0}
        )).to.be.true;

        expect(eqp(
            re.pointsOfInterest(POIPurpose.MANIPULATION)[POI.bottomRight],
            { x: 0, y: 50}
        )).to.be.true;
    });
});