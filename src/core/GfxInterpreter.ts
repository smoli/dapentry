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
import {GrObject} from "../geometry/GrObject";
import {GfxComposite, GfxObjectList} from "../runtime/gfx/GfxObject";
import {GfxScale} from "../runtime/gfx/GfxScale";
import {GfxExtendPolygon} from "../runtime/gfx/GfxExtendPolygon";
import {Parameter} from "../runtime/interpreter/Parameter";
import {GrCompositeObject} from "../geometry/GrCompositeObject";
import {Library, LibraryEntry} from "./Library";
import {getHeightForWidth, GrCanvas} from "../geometry/GrCanvas";
import {Point2Parameter} from "../runtime/interpreter/types/Point2Parameter";
import {AppConfig} from "./AppConfig";
import {GfxStrokeColor} from "../runtime/gfx/GfxStrokeColor";
import {GfxFillOpacity} from "../runtime/gfx/GfxFillOpacity";
import {GfxText} from "../runtime/gfx/GfxText";
import {ArrayIterator} from "../runtime/interpreter/types/ArrayIterator";

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
function makeGfxOperation(OpClass: ( typeof Operation ), objectCallBack: (GrObject) => void) {
    return class C extends OpClass {
        async execute(interpreter: Interpreter): Promise<any> {
            const r = await super.execute(interpreter);
            objectCallBack(( this as unknown as GfxOperation ).target);
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

        let objCallback = this.objectCallBack.bind(this);
        if (AppConfig.Runtime.grObjectsGlobal) {
            objCallback = this.objectCallBackGlobal.bind(this);
        }

        Object.values(AppConfig.Runtime.Opcodes.Circle)
            .forEach(opcode => {
                this.addOperation(opcode, makeGfxOperation(GfxCircle, objCallback));
            })

        Object.values(AppConfig.Runtime.Opcodes.Rect)
            .forEach(opcode => {
                this.addOperation(opcode, makeGfxOperation(GfxRect, objCallback));
            })

        Object.values(AppConfig.Runtime.Opcodes.Line)
            .forEach(opcode => {
                this.addOperation(opcode, makeGfxOperation(GfxLine, objCallback));
            })

        Object.values(AppConfig.Runtime.Opcodes.Move)
            .forEach(opcode => {
                this.addOperation(opcode, makeGfxOperation(GfxMove, objCallback));
            })

        this.addOperation(AppConfig.Runtime.Opcodes.Poly.Create, makeGfxOperation(GfxPolygon, objCallback));
        this.addOperation(AppConfig.Runtime.Opcodes.Poly.Extend, makeGfxOperation(GfxExtendPolygon, objCallback));

        this.addOperation("QUAD", makeGfxOperation(GfxQuadratic, objCallback));
        this.addOperation("BEZIER", makeGfxOperation(GfxBezier, objCallback));
        this.addOperation(AppConfig.Runtime.Opcodes.Text, makeGfxOperation(GfxText, objCallback));

        this.addOperation("ROTATE", makeGfxOperation(GfxRotate, objCallback));
        this.addOperation("SCALE", makeGfxOperation(GfxScale, objCallback));

        this.addOperation(AppConfig.Runtime.Opcodes.FillColor, makeGfxOperation(GfxFill, objCallback));
        this.addOperation(AppConfig.Runtime.Opcodes.FillOpacity, makeGfxOperation(GfxFillOpacity, objCallback));
        this.addOperation(AppConfig.Runtime.Opcodes.StrokeColor, makeGfxOperation(GfxStrokeColor, objCallback));
        this.addOperation(AppConfig.Runtime.Opcodes.StrokeWidth, makeGfxOperation(GfxStroke, objCallback));

        if (this._library) {
            // This operation makes only sense if the interpreter has a library.
            // This basically prevents nested instantiation for now.
            // TODO: Do we want nested instantiation? How do we prevent to many recursions?
            this.addOperation("MAKE", makeGfxOperation(GfxMake, objCallback));
        }

        this.addOperation("OBLIST", GfxObjectList);
        this.addOperation("COMPOSITE", GfxComposite);
    }

    get library(): Library {
        return this._library;
    }

    get code(): Array<string> {
        return this._program.map(p => p ? p.opcode : "NOP");
    }

    protected objectCallBack(object: GrObject) {
        if (object.uniqueName.startsWith("$")) {
            return;
        }

        this._objects[object.uniqueName] = object;
        this._lastObjectTouched = object;
    }

    protected objectCallBackGlobal(object: GrObject) {
        if (object.uniqueName.startsWith("$")) {
            return;
        }

        this._objects[object.uniqueName] = object;
        this._globals.setRegister(object.uniqueName, object);
        this._lastObjectTouched = object;
    }

    clearObjects(canvas: GrCanvas = null) {
        this._objects = {};

        if (canvas) {
            this._objects[canvas.uniqueName] = canvas;
        }
    }

    get objects(): Array<GrObject> {
        return Object.values(this._objects);
    }

    get lastObjectTouched(): GrObject {
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

    protected _getParam(param) {
        let r = null;
        if (param.isRegister) {
            if (param.components) {
                return this.closure.getRegisterWithComponents(param.name, param.components);
            }
            r = this.closure.getRegister(param.name);
        } else {
            r = param.value;
        }

        return r;
    }


    getArg(arg): any {
        const v = this._getParam(arg);

        if (Array.isArray(v)) {
            return v.map(v => v instanceof Parameter ? this._getParam(v) : v)
        }

        return v;
    }

    protected getScopeCode(): Array<string> {
        const code = this._entry.arguments.map((field, i) => {
            const arg = this._args && this._args[i];
            let v = field.default;
            if (arg && arg.isRegister) {
                v = this.getArg(arg)

                if (v instanceof ArrayIterator) {
                    v = v.array;
                }
            }

            if (Array.isArray(v)) {
                    return `ITER ${field.name}, [${v.join(", ")}]`;
            }
            return `LOAD ${field.name}, ${v}`;
        });

        code.push(...this._entry.fields.map(field => {
            if (Array.isArray(field.default)) {
                return `ITER ${field.name}, [${field.default.join(", ")}]`;
            }
            return `LOAD ${field.name}, ${field.default}`;
        }))

        return code;
    }

    protected setup(outerInterpreter: GfxInterpreter) {
        if (!this._entry) {
            this._entry = outerInterpreter.library.getEntry(this._entryID.value);
        }

        // We do this everytime, because the arguments may contain code...
        const code = this.getScopeCode().join("\n") + "\n" + this._entry.code;
        console.log(code);
        this._interpreter.parse(code);
        // We do this everytime, because when we're in a loop and width points to a register
        // the value of width might change between iterations.
        this._canvas = GrCanvas.create(this._entry.aspectRatio, this._width.finalized(this.closure));
    }


    get styles(): any {
        return this._styles.finalized(this.closure);
    }

    async execute(outerInterpreter: GfxInterpreter): Promise<any> {
        this.setup(outerInterpreter);

        this._interpreter.clearObjects();
        await this._interpreter.run({
            [AppConfig.Runtime.styleRegisterName]: this.styles,
            [this._canvas.uniqueName]: this._canvas
        });

        const resultObject: GrCompositeObject = this._interpreter.getRegister("o") as GrCompositeObject;

        resultObject.updateName(this._target.name);
        resultObject.width = this._width.finalized(this.closure);
        resultObject.height = getHeightForWidth(resultObject.width, this._entry.aspectRatio);
        const p = this._position.finalized(this.closure);

        resultObject.x = p.x;
        resultObject.y = p.y;

        this.target = resultObject;
    }

}