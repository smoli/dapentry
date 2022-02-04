import {runCode} from "./toolRunCode";
import {performance} from "perf_hooks";
import {GrLine} from "../src/geometry/GrLine";
import {GrPolygon} from "../src/geometry/GrPolygon";
import {POI} from "../src/geometry/GrObject";
import {AppConfig} from "../src/AppConfig";
import {Point2D} from "../src/geometry/Point2D";

const iterations = 1000;

const code = `LOAD f2, ${iterations}
        LINE Line1, ${AppConfig.Runtime.defaultStyleRegisterName}, Canvas@center, Canvas@top
POLY Polygon1, ${AppConfig.Runtime.defaultStyleRegisterName}, [ Line1@end ], 1
DO f2
ROTATE Line1, 180 / f2, Line1@start
EXTPOLY Polygon1, [ Line1@0.65 ]
ROTATE Line1, 180 / f2, Line1@start
EXTPOLY Polygon1, [ Line1@end ]
ENDDO
FILL Polygon1, "#ed0707", 1
STROKECOLOR Polygon1, "rgba(183, 36, 36, 1)"
STROKE Polygon1, 59
        `;

let start = performance.now();
let end
const i = runCode(code).then(() => {

    end = performance.now();
    console.log(end - start)

    start = performance.now();
    const Line1 = GrLine.create("line1", 500, 500, 500, 0);
    const Poly1 = GrPolygon.create("poly1", [Line1.end], true);
    const f2 = iterations;
    for (let i = 0; i < f2; i++) {
        Line1.rotatePOI(POI.start, 180 / f2);
        Poly1.addPoint(Line1.at(0.5) as Point2D);
        Line1.rotatePOI(POI.start, 180 / f2);
        Poly1.addPoint(Line1.end);
    }
    end = performance.now();
    console.log(end - start)
});

