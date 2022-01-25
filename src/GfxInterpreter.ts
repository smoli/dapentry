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
import {GfxFill, GfxStrokeColor} from "./runtime/gfx/GfxFill";
import {GfxStroke} from "./runtime/gfx/GfxStroke";
import {GrObject} from "./Geo/GrObject";
import {GfxComposite, GfxObjectList} from "./runtime/gfx/GfxObject";
import {GfxScale} from "./runtime/gfx/GfxScale";
import {GfxExtendPolygon} from "./runtime/gfx/GfxExtendPolygon";
import {Parameter} from "./runtime/interpreter/Parameter";
import {GrCompositeObject} from "./Geo/GrCompositeObject";
import {Library, LibraryEntry} from "./Library";
import {GrCanvas} from "./Geo/GrCanvas";

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
    private _library: Library;


    constructor(library: Library) {
        super();

        this._library = library;

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
        this.addOperation("STROKECOLOR", makeGfxOperation(GfxStrokeColor, this.objectCallBack.bind(this)));
        this.addOperation("STROKE", makeGfxOperation(GfxStroke, this.objectCallBack.bind(this)));

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
    private readonly _args: Array<Parameter>;


    constructor(opcode, target: Parameter, entryID: Parameter, styles: Parameter, width: Parameter, ...args: Array<Parameter>) {
        super(opcode, target);
        this._styles = styles;
        this._entryID = entryID;

        if (this._entryID.isRegister) {
            throw new Error("Only string literals are allowed when providing a library entry")
        }
        this._args = args;
        this._width = width;

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
            "$styles": this.styles,
            [this._canvas.uniqueName]: this._canvas,
            ...this.getScope()
        });

        const resultObject:GrCompositeObject = this._interpreter.getRegister("o") as GrCompositeObject;

        resultObject.updateName(this._target.name);

        this.target = resultObject;
    }

}