import {runCode} from "./toolRunCode";
import {performance} from "perf_hooks";
import {GrLine} from "../Geo/GrLine";
import {GrPolygon} from "../Geo/GrPolygon";
import {POI} from "../Geo/GrObject";


const code = `LOAD f2, 10000
        LINE Line1, $styles.default, Canvas@center, Canvas@top
POLY Polygon1, $styles.default, [ Line1@end ], 1
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
    const f2 = 10000;
    for (let i = 0; i < f2; i++) {
        Line1.rotatePOI(POI.start, 180 / f2);
        Poly1.addPoint(Line1.at(0.5));
        Line1.rotatePOI(POI.start, 180 / f2);
        Poly1.addPoint(Line1.end);
    }
    end = performance.now();
    console.log(end - start)
});

