import {GrCanvas} from "../src/geometry/GrCanvas";
import {GrLine} from "../src/geometry/GrLine";
import {GrPolygon} from "../src/geometry/GrPolygon";
import {SvgObjectRenderer} from "../src/ui/drawing/SvgObjectRenderer";

(() => {

    const code = `
LINEPP Line1, $styles.default, Canvas@center, Canvas@top
DO spokes
POLY Polygon1, $styles.default, [ Line1@end ], 1
ROTATE Line1, angle, Line1@start
EXTPOLY Polygon1, [ Line1@0.59 ]
ROTATE Line1, angle, Line1@start
ENDDO    
    `;

    function drawing(spokes) {

        const objects = {};

        let angle = 180 / spokes;

        objects.canvas = GrCanvas.create_1_1(1000);

        objects.Line1 = new GrLine(
            "Line1",
            objects.canvas.center.x,
            objects.canvas.center.y,
            objects.canvas.top.x,
            objects.canvas.top.y);

        for (let i = 0; i < spokes; i++) {
            if (!objects.Polygon1) {
                objects.Polygon1 = new GrPolygon("Polygon1", [objects.Line1.end], true);
            } else {
                objects.Polygon1.addPoint(objects.Line1.end);
            }

            objects.Line1.rotateByDeg(angle, objects.Line1.start)
            objects.Polygon1.addPoint(objects.Line1.at(0.59));
            objects.Line1.rotateByDeg(angle, objects.Line1.start)
        }

        return [objects.Polygon1];
    }


    const renderer = new SvgObjectRenderer(null, false);
    renderer.init("dapentry-container");

    drawing(50).forEach(o => renderer.render(o, false));
})()

