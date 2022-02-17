import {describe, it} from "mocha";
import {expect} from "chai"
import {GrCircle} from "../../src/geometry/GrCircle";
import {eq, eqp} from "../../src/geometry/GeoMath";
import {GrRectangle} from "../../src/geometry/GrRectangle";
import {GrObjectList} from "../../src/geometry/GrObjectList";
import {StyleManager} from "../../src/core/StyleManager";
import {AppConfig} from "../../src/core/AppConfig";




describe('GrObjectList', () => {

    const sm = new StyleManager();

    it("holds multiple objects of different kinds", () => {
        let c = GrCircle.create(null, 0, 0, 100);
        let r = GrRectangle.create(null, 0, 0, 100, 100);

        let l = new GrObjectList(null);

        l.addObject(c);
        l.addObject(r);

        expect(l.objects.length).to.equal(2);
        expect(l.objects[0]).to.equal(c);
        expect(l.objects[1]).to.equal(r);
    });

    it("uses the style info of the last object in its list", () => {
        let c = GrCircle.create(null, 0, 0, 100);
        let r = GrRectangle.create(null, 0, 0, 100, 100);
        c.style = sm.styles["default"];
        r.style = sm.styles["default"];

        let l = new GrObjectList(null);
        r.fillOpacity = 0.5;
        r.fillColor = "orange";
        r.strokeColor = "green";
        r.strokeWidth = 30;

        l.addObject(c);
        l.addObject(r);

        expect(l.fillOpacity).to.equal(0.5);
        expect(l.fillColor).to.equal("orange");
        expect(l.strokeColor).to.equal("green");
        expect(l.strokeWidth).to.equal(30);

        expect(l.style.fillOpacity).to.equal(0.5);
        expect(l.style.fillColor).to.equal("orange");
        expect(l.style.strokeColor).to.equal("green");
        expect(l.style.strokeWidth).to.equal(30);

    })


});