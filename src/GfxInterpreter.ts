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
import {GrObject} from "./Geo/GrObject";
import {GfxComposite, GfxObjectList} from "./runtime/gfx/GfxObject";
import {GfxScale} from "./runtime/gfx/GfxScale";
import {GfxExtendPolygon} from "./runtime/gfx/GfxExtendPolygon";
import {Parameter} from "./runtime/interpreter/Parameter";
import {GrCompositeObject} from "./Geo/GrCompositeObject";

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
            const r = await super.execute(interpreter);
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
        this.addOperation("EXTPOLY", makeGfxOperation(GfxExtendPolygon, this.objectCallBack.bind(this)));
        this.addOperation("QUAD", makeGfxOperation(GfxQuadratic, this.objectCallBack.bind(this)));
        this.addOperation("BEZIER", makeGfxOperation(GfxBezier, this.objectCallBack.bind(this)));
        this.addOperation("MOVE", makeGfxOperation(GfxMove, this.objectCallBack.bind(this)));
        this.addOperation("ROTATE", makeGfxOperation(GfxRotate, this.objectCallBack.bind(this)));
        this.addOperation("SCALE", makeGfxOperation(GfxScale, this.objectCallBack.bind(this)));
        this.addOperation("FILL", makeGfxOperation(GfxFill, this.objectCallBack.bind(this)));
        this.addOperation("STROKE", makeGfxOperation(GfxStroke, this.objectCallBack.bind(this)));
        this.addOperation("MAKE", makeGfxOperation(GfxMake, this.objectCallBack.bind(this)));

        this.addOperation("OBLIST", GfxObjectList);
        this.addOperation("COMPOSITE", GfxComposite);
    }

    get code():Array<string> {
        return this._program.map(p => p ? p.opcode : "NOP");
    }

    protected objectCallBack(object:GrObject) {
        if (object.uniqueName.startsWith("$")) {
            return;
        }


        this._objects[object.uniqueName] = object;
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

class GfxMake extends GfxOperation {
    private _interpreter: GfxInterpreter;
    private _styles: Parameter;
    private _code: string;


    constructor(opcode, target: Parameter, styles: Parameter) {
        super(opcode, target);
        this._styles = styles;
        this._code = `COMPOSITE o
LINE Line1, $styles.default, (362, 364), (832, 364)
POLY Polygon2, $styles.default, [ Line1@end ], 1
APP o.objects, Polygon2
DO 5
ROTATE Line1, 180  / 5
EXTPOLY Polygon2, [ Line1@0.75]
ROTATE Line1, 180 / 5
EXTPOLY Polygon2, [ Line1@end ]
ENDDO
FILL Polygon2, "#fce654", 0.1
`;

        this._interpreter = new GfxInterpreter();
        this._interpreter.parse(this._code);
    }

    get styles(): any {
        return this._styles.finalized(this.closure);
    }

    async execute(): Promise<any> {
        this._interpreter.clearObjects();
        await this._interpreter.run({
            "$styles": this.styles
        });

        const resultObject:GrCompositeObject = this._interpreter.getRegister("o") as GrCompositeObject;

        resultObject.updateName(this._target.name);

        this.target = resultObject;
    }

}