import {describe, it} from "mocha";
import {expect} from "chai"
import {GrObject} from "../../src/geometry/GrObject";
import {GrRectangle} from "../../src/geometry/GrRectangle";
import {Point2D} from "../../src/geometry/Point2D";
import {eqp} from "../../src/geometry/GeoMath";


describe('GrObject', () => {

    it("Has its own local coordinate system and can transform points back and forth", () => {
        const o = new GrRectangle("o", 100, 100, 100, 100);

        const p1 = new Point2D(100, 100);
        const p2 = new Point2D(0, 0);
        const p3 = new Point2D(20, 10);

        let mp1 = o.mapPointToLocal(p1);
        let gp1 = o.mapLocalToWorld(mp1);
        expect(eqp(mp1, { x: 0, y: 0})).to.be.true;
        expect(eqp(gp1, p1)).to.be.true;

        let mp2 = o.mapPointToLocal(p2);
        let gp2 = o.mapLocalToWorld(mp2);
        expect(eqp(mp2, { x: -100, y: -100})).to.be.true;
        expect(eqp(gp2, p2)).to.be.true;

        let mp3 = o.mapPointToLocal(p3);
        let gp3 = o.mapLocalToWorld(mp3);
        expect(eqp(mp3, {x: -80, y: -90})).to.be.true;
        expect(eqp(gp3, p3)).to.be.true;

        o.rotateByDeg(90);

        mp1 = o.mapPointToLocal(p1);
        gp1 = o.mapLocalToWorld(mp1);
        expect(eqp(mp1, { x: 0, y: 0})).to.be.true;
        expect(eqp(gp1, p1)).to.be.true;

        mp2 = o.mapPointToLocal(p2);
        gp2 = o.mapLocalToWorld(mp2);
        expect(eqp(mp2, { x: -100, y: 100})).to.be.true;
        expect(eqp(gp2, p2)).to.be.true;

        mp3 = o.mapPointToLocal(p3);
        gp3 = o.mapLocalToWorld(mp3);
        expect(eqp(mp3, {x: -90, y: 80})).to.be.true;
        expect(eqp(gp3, p3)).to.be.true;


        o.rotateByDeg(24.53450);

        mp1 = o.mapPointToLocal(p1);
        gp1 = o.mapLocalToWorld(mp1);
        expect(eqp(gp1, p1)).to.be.true;

        mp2 = o.mapPointToLocal(p2);
        gp2 = o.mapLocalToWorld(mp2);
        expect(eqp(gp2, p2)).to.be.true;

        mp3 = o.mapPointToLocal(p3);
        gp3 = o.mapLocalToWorld(mp3);
        expect(eqp(gp3, p3)).to.be.true;

    });
});