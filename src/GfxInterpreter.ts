import {Interpreter} from "./runtime/interpreter/Interpreter";
import {Operation} from "./runtime/interpreter/Operation";
import {GfxOperation} from "./runtime/gfx/GfxOperation";
import {GfxCircle} from "./runtime/gfx/GfxCircle";
import {GfxRect} from "./runtime/gfx/GfxRect";
import {GfxLine} from "./runtime/gfx/GfxLine";
import {GfxPolygon} from "./runtime/gfx/GfxPolygon";
import {GfxBezier, GfxQuadratic} from "./runtime/gfx/GfxQuadratic";
import {GfxMove} from "./runtime/gfx/GfxMove";
import {GfxRotate} from "./runtime/gfx/GfxRotate";
import {GfxFill} from "./runtime/gfx/GfxFill";
import {GfxStroke} from "./runtime/gfx/GfxStroke";
import {GrObject} from "./controls/drawing/Objects/GrObject";
import {GfxObjectList} from "./runtime/gfx/GfxObject";

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
    private _objects: { [key: string]: GrObject };


    constructor() {
        super();

        this.addOperation("CIRCLE", makeGfxOperation(GfxCircle, this.objectCallBack.bind(this)));
        this.addOperation("RECT", makeGfxOperation(GfxRect, this.objectCallBack.bind(this)));
        this.addOperation("LINE", makeGfxOperation(GfxLine, this.objectCallBack.bind(this)));
        this.addOperation("POLY", makeGfxOperation(GfxPolygon, this.objectCallBack.bind(this)));
        this.addOperation("QUAD", makeGfxOperation(GfxQuadratic, this.objectCallBack.bind(this)));
        this.addOperation("BEZIER", makeGfxOperation(GfxBezier, this.objectCallBack.bind(this)));
        this.addOperation("MOVE", makeGfxOperation(GfxMove, this.objectCallBack.bind(this)));
        this.addOperation("ROTATE", makeGfxOperation(GfxRotate, this.objectCallBack.bind(this)));
        this.addOperation("FILL", makeGfxOperation(GfxFill, this.objectCallBack.bind(this)));
        this.addOperation("STROKE", makeGfxOperation(GfxStroke, this.objectCallBack.bind(this)));
        this.addOperation("OBLIST", GfxObjectList);
    }

    protected objectCallBack(object:GrObject) {
        this._objects[object.name] = object;
        this._lastObjectTouched = object;
    }

    clearObjects() {
        this._objects = {};
    }

    get objects():Array<GrObject> {
        return Object.values(this._objects);
    }

    get lastObjectTouched():GrObject {
        return this._lastObjectTouched;
    }
}