import {Interpreter} from "../runtime/interpreter/Interpreter";
import {Operation} from "../runtime/interpreter/Operation";
import {GfxOperation} from "../runtime/gfx/GfxOperation";
import {GfxCircle} from "../runtime/gfx/GfxCircle";
import {GfxRect} from "../runtime/gfx/GfxRect";
import {GfxLine} from "../runtime/gfx/GfxLine";
import {GfxPolygon} from "../runtime/gfx/GfxPolygon";
import {GfxBezier, GfxQuadratic} from "../runtime/gfx/GfxQuadratic";
import {GfxMove} from "../runtime/gfx/GfxMove";
import {GfxRotate} from "../runtime/gfx/GfxRotate";
import {GfxFill} from "../runtime/gfx/GfxFill";
import {GfxStroke} from "../runtime/gfx/GfxStroke";
import {GrObject, POI} from "../geometry/GrObject";
import {GfxComposite, GfxObjectList} from "../runtime/gfx/GfxObject";
import {GfxScale} from "../runtime/gfx/GfxScale";
import {GfxExtendPolygon} from "../runtime/gfx/GfxExtendPolygon";
import {Parameter} from "../runtime/interpreter/Parameter";
import {GrCompositeObject} from "../geometry/GrCompositeObject";
import {Library, LibraryEntry} from "./Library";
import {GrCanvas} from "../geometry/GrCanvas";
import {Point2Parameter} from "../runtime/interpreter/types/Point2Parameter";
import {AppConfig} from "./AppConfig";
import {GfxStrokeColor} from "../runtime/gfx/GfxStrokeColor";
import {GfxFillOpacity} from "../runtime/gfx/GfxFillOpacity";

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
    private readonly _library: Library;


    constructor(library: Library = null) {
        super();

        this._library = library;

        Object.values(AppConfig.Runtime.Opcodes.Circle)
            .forEach(opcode => {
                this.addOperation(opcode, makeGfxOperation(GfxCircle, this.objectCallBack.bind(this)));
            })

        Object.values(AppConfig.Runtime.Opcodes.Rect)
            .forEach(opcode => {
                this.addOperation(opcode, makeGfxOperation(GfxRect, this.objectCallBack.bind(this)));
            })

        Object.values(AppConfig.Runtime.Opcodes.Line)
            .forEach(opcode => {
                this.addOperation(opcode, makeGfxOperation(GfxLine, this.objectCallBack.bind(this)));
            })

        Object.values(AppConfig.Runtime.Opcodes.Move)
            .forEach(opcode => {
                this.addOperation(opcode, makeGfxOperation(GfxMove, this.objectCallBack.bind(this)));
            })

        this.addOperation(AppConfig.Runtime.Opcodes.Poly.Create, makeGfxOperation(GfxPolygon, this.objectCallBack.bind(this)));
        this.addOperation(AppConfig.Runtime.Opcodes.Poly.Extend, makeGfxOperation(GfxExtendPolygon, this.objectCallBack.bind(this)));

        this.addOperation("QUAD", makeGfxOperation(GfxQuadratic, this.objectCallBack.bind(this)));
        this.addOperation("BEZIER", makeGfxOperation(GfxBezier, this.objectCallBack.bind(this)));

        this.addOperation("ROTATE", makeGfxOperation(GfxRotate, this.objectCallBack.bind(this)));
        this.addOperation("SCALE", makeGfxOperation(GfxScale, this.objectCallBack.bind(this)));

        this.addOperation(AppConfig.Runtime.Opcodes.FillColor, makeGfxOperation(GfxFill, this.objectCallBack.bind(this)));
        this.addOperation(AppConfig.Runtime.Opcodes.FillOpacity, makeGfxOperation(GfxFillOpacity, this.objectCallBack.bind(this)));
        this.addOperation(AppConfig.Runtime.Opcodes.StrokeColor, makeGfxOperation(GfxStrokeColor, this.objectCallBack.bind(this)));
        this.addOperation(AppConfig.Runtime.Opcodes.StrokeWidth, makeGfxOperation(GfxStroke, this.objectCallBack.bind(this)));

        if (this._library) {
            // This operation makes only sense if the interpreter has a library.
            // This basically prevents nested instantiation for now.
            // TODO: Do we want nested instantiation? How do we prevent recursion?
            this.addOperation("MAKE", makeGfxOperation(GfxMake, this.objectCallBack.bind(this)));
        }

        this.addOperation("OBLIST", GfxObjectList);
        this.addOperation("COMPOSITE", GfxComposite);
    }

    get library():Library {
        return this._library;
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

    clearObjects(canvas: GrCanvas = null) {
        this._objects = {};

        if (canvas) {
            this._objects[canvas.uniqueName] = canvas;
        }
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
    private _entry: LibraryEntry;
    private _entryID: Parameter;
    private _canvas: GrCanvas;
    private _width: Parameter;
    private _position: Point2Parameter;
    private readonly _args: Array<Parameter>;


    constructor(opcode, target: Parameter, entryID: Parameter, styles: Parameter, width: Parameter, position: Point2Parameter, ...args: Array<Parameter>) {
        super(opcode, target);
        this._styles = styles;
        this._entryID = entryID;

        if (this._entryID.isRegister) {
            throw new Error("Only string literals are allowed when providing a library entry")
        }
        this._args = args;
        this._width = width;
        this._position = position;

        this._interpreter = new GfxInterpreter(null);
    }


    protected setup(outerInterpreter: GfxInterpreter) {
        if (!this._entry) {
            this._entry = outerInterpreter.library.getEntry(this._entryID.value);
            this._interpreter.parse(this._entry.code);
        }

        // We do this everytime, because when we're in a loop and width points to a register
        // the value of width might change between iterations.
        this._canvas = GrCanvas.create(this._entry.aspectRatio, this._width.finalized(this.closure));
    }

    protected getScope(): { [key: string]: any } {
        const ret = {};

        if (!this._entry) {
            return {};
        }

        let i = 0;
        for (const k in this._entry.arguments) {
            if (this._args && this._args[i]) {
                ret[k] = this._args[i].finalized(this.closure);
            } else {
                ret[k] = this._entry.arguments[k].default;
            }
            i++;
        }

        return ret;
    }

    get styles(): any {
        return this._styles.finalized(this.closure);
    }

    async execute(outerInterpreter: GfxInterpreter): Promise<any> {
        this.setup(outerInterpreter);

        this._interpreter.clearObjects();
        await this._interpreter.run({
            [AppConfig.Runtime.styleRegisterName]: this.styles,
            [this._canvas.uniqueName]: this._canvas,
            ...this.getScope()
        });

        const resultObject:GrCompositeObject = this._interpreter.getRegister("o") as GrCompositeObject;

        resultObject.updateName(this._target.name);

        resultObject.movePOI(POI.center, this._position.finalized(this.closure).sub(resultObject.center));

        this.target = resultObject;
    }

}