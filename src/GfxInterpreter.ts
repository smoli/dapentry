import {Interpreter} from "./runtime/interpreter/Interpreter";
import {Operation} from "./runtime/interpreter/Operation";
import {GfxOperation} from "./runtime/gfx/GfxOperation";
import {GfxCircle} from "./runtime/gfx/GfxCircle";
import {GfxRect} from "./runtime/gfx/GfxRect";
import {GfxLine} from "./runtime/gfx/GfxLine";
import {GfxPolygon} from "./runtime/gfx/GfxPolygon";
import {GfxQuadratic} from "./runtime/gfx/GfxQuadratic";
import {GfxMove} from "./runtime/gfx/GfxMove";
import {GfxRotate} from "./runtime/gfx/GfxRotate";
import {GfxFill} from "./runtime/gfx/GfxFill";
import {GfxStroke} from "./runtime/gfx/GfxStroke";
import {GrObject} from "./controls/drawing/Objects/GrObject";

/**
 * Creates a operation class that calls a callback for the grObject
 * created/manipulated.
 *
 * TODO: I obviously haven't understood the typing properly, as I expected
 *       OpClass: (typeof GfxOperation) to work. But it didn't :-(
 *
 * @param OpClass
 * @param objectCallBack
 */
function makeGfxOperation(OpClass: (typeof Operation), objectCallBack: (GrObject) => void) {
    return class C extends OpClass {
        async execute(interpreter: Interpreter): Promise<any> {
            const r = super.execute(interpreter);
            objectCallBack((this as unknown as GfxOperation).target);
            return r;
        }
    }
}

export class GfxInterpreter extends Interpreter {

    private _lastObjectTouched: GrObject;


    constructor() {
        super();

        this.addOperation("CIRCLE", makeGfxOperation(GfxCircle, this.setLastObjectTouched.bind(this)));
        this.addOperation("RECT", makeGfxOperation(GfxRect, this.setLastObjectTouched.bind(this)));
        this.addOperation("LINE", makeGfxOperation(GfxLine, this.setLastObjectTouched.bind(this)));
        this.addOperation("POLY", makeGfxOperation(GfxPolygon, this.setLastObjectTouched.bind(this)));
        this.addOperation("QUAD", makeGfxOperation(GfxQuadratic, this.setLastObjectTouched.bind(this)));
        this.addOperation("MOVE", makeGfxOperation(GfxMove, this.setLastObjectTouched.bind(this)));
        this.addOperation("ROTATE", makeGfxOperation(GfxRotate, this.setLastObjectTouched.bind(this)));
        this.addOperation("FILL", makeGfxOperation(GfxFill, this.setLastObjectTouched.bind(this)));
        this.addOperation("STROKE", makeGfxOperation(GfxStroke, this.setLastObjectTouched.bind(this)));
    }

    protected setLastObjectTouched(object:GrObject) {
        this._lastObjectTouched = object;
    }

    get lastObjectTouched():GrObject {
        return this._lastObjectTouched;
    }
}