import {runCode} from "./toolRunCode";
import {performance} from "perf_hooks";
import {GrLine} from "../src/geometry/GrLine";
import {GrPolygon} from "../src/geometry/GrPolygon";
import {POI} from "../src/geometry/GrObject";


const code = `LOAD r1, 22
    CALL res, FIB: 
    JMP END:
    
    FIB:
        JEQ r1, 0, ZERO:
        JEQ r1, 1, ONE:
        JMP ELSE:
    
        ZERO:
            LOAD r2, 0
            RET r2
            
        ONE:
            LOAD r2, 1
            RET r2
  
        ELSE:                    
            DEC r1
            CALL r3, FIB:
            
            DEC r1
            CALL r4, FIB:
            
            ADD r3, r4
            RET r3
    
  END:
        `;

let start = performance.now();
let end
const i = runCode(code).then(() => {

    end = performance.now();
    console.log(end - start);
});

