import {AppConfig} from "./AppConfig";
import {ToolNames} from "../tools/ToolNames";
import {State} from "../state/State";
import {BaseAction} from "../actions/BaseAction";
import {AddStatement} from "../actions/AddStatement";
import {GfxInterpreter} from "./GfxInterpreter";
import {AspectRatio, GrCanvas} from "../geometry/GrCanvas";
import {StyleManager} from "./StyleManager";
import {GrObject} from "../geometry/GrObject";
import {SetFillColor} from "../actions/SetFillColor";
import {SetFillOpacity} from "../actions/SetFillOpacity";
import {SetStrokeColor} from "../actions/SetStrokeColor";
import {SetStrokeWidth} from "../actions/SetStrokeWidth";
import {Persistence} from "../state/Persistence";

type PerformanceMeasurement = { [key: string]: DOMHighResTimeStamp };

class PerformanceMeasure {
    protected measurements: Array<PerformanceMeasurement> = [];
    protected current: PerformanceMeasurement = null;

    constructor() {
        this.reset();
    }

    reset() {
        this.current = {};
        this.measurements.push(this.current);
    }

    now(key: string) {
        this.current[key] = performance.now();
    }

    print() {
        console.group("------------------Performance------------------");
        let l = null;
        for (const k in this.current) {
            if (!l) {
                l = this.current[k];
            } else {
                const e = this.current[k] - l;
                console.log(k, e);
                l = this.current[k];
            }
        }
        console.groupEnd();
    }
}

export interface ApplicationOptions {
    aspectRatio?: AspectRatio,
    drawingWidth?: number
}

const applicationDefaults: ApplicationOptions = {
    aspectRatio: AspectRatio.ar1_1,
    drawingWidth: 1000
}


export class AppController {
    private readonly _state: State;
    private _interpreter: GfxInterpreter;
    private _canvas: GrCanvas;
    private _performance: PerformanceMeasure = new PerformanceMeasure();
    private _styleManager: StyleManager = new StyleManager();

    constructor(state: State,
                interpreter: GfxInterpreter,
                options: ApplicationOptions = {}) {
        this._state = state;
        this._interpreter = interpreter;

        this.processOptions({
            ...applicationDefaults,
            ...options
        })

        this._state.setDrawingDimensions(this._canvas.width, this._canvas.height);
    }

    protected processOptions(options:ApplicationOptions) {
        this._canvas = GrCanvas.create(options.aspectRatio, options.drawingWidth);
    }

    init() {
        this._state.setObjectsOnDrawing([this._canvas]);
    }

    public async setAspectRatio(ar: AspectRatio) {
        this._canvas = GrCanvas.create(ar, 1000);
        this._state.setDrawingDimensions(this._canvas.width, this._canvas.height);
        this._state.setAspectRatio(ar);

        await this.runCode();
        this.updateDrawing();
    }

    get state(): State {
        return this._state;
    }

    public async load(persistence:Persistence):Promise<any> {
        await this._state.load(persistence);
        await this.runCode();
        this.updateDrawing();
    }

    protected async runCode(): Promise<any> {
        this._interpreter.clearObjects(this._canvas);
        this._performance.reset();
        this._performance.now("start");
        console.log(this.state.fullCode);
        this._interpreter.parse(this.state.fullCode);
        this._performance.now("parsed");

        /*
                TODO: Fix this
                const index = this.getAppState().getLastSelectedCodeLineIndex();

                if (index !== -1) {
                    this._interpreter.pauseAfter(index + this.getAppState().scopeCodeLength);
                } else {
                    this._interpreter.clearPauseAfter();
                }
        */

        await this._interpreter.run({
            [AppConfig.Runtime.styleRegisterName]: this._styleManager.styles,
            "$lastObject": null,
            [this._canvas.name]: this._canvas
        });
        this._performance.now("computed");
        return Promise.resolve();
    }

    protected updateDrawing() {
        this._state.setObjectsOnDrawing(this._interpreter.objects);
    }


    protected async execute(action: BaseAction) {
        action.controller = this;
        await action.execute(null);
    }

    async addStatement(code: string) {
        await this.execute(new AddStatement([code]));
        await this.runCode();
        this.updateDrawing();
    }

    async addStatements(code: Array<string>) {
        await this.execute(new AddStatement(code));
        await this.runCode();
        this.updateDrawing();
    }

    public async setFillColorForSelection(value: string) {
        await this.execute(new SetFillColor(this.state.selection, value));
        await this.runCode();
        this.updateDrawing()
    }

    public async setFillOpacityForSelection(value: number) {
        await this.execute(new SetFillOpacity(this.state.selection, value));
        await this.runCode();
        this.updateDrawing()
    }

    public async setStrokeColorForSelection(value: string) {
        await this.execute(new SetStrokeColor(this.state.selection, value));
        await this.runCode();
        this.updateDrawing()
    }

    public async setStrokeWidthForSelection(value: number) {
        await this.execute(new SetStrokeWidth(this.state.selection, value));
        await this.runCode();
        this.updateDrawing()
    }

    public handleObjectSelection(object: GrObject) {
        if (!object.isSelectable) {
            return;
        }

        if (this.state.isObjectSelected(object)) {
            this.state.deselectObject(object);
        } else {
            this.state.deselectAll();
            this.state.selectObject(object);
        }
    }


    public switchTool(newTool: ToolNames) {
        this._state.switchTool(newTool);
    }

    protected switchToDrawTool(newTool: ToolNames) {
        this._state.deselectAll();
        this.switchTool(newTool);
    }

    protected selectReferenceObjectForTool() {
        const current = this.state.referenceObjectForTool;
        const objects = this.state.objects;
        let i = current ? objects.indexOf(current) : -1;
        i += 1;

        console.log(current, i);

        while (i < objects.length) {
            const next = objects[i];
            if (!this.state.isObjectSelected(next) && !(next instanceof GrCanvas)) {
                this.state.setReferenceObjectForTool(next);
                return;
            }

            i += 1;
        }
        this.state.setReferenceObjectForTool(null);
    }

    protected passKeyPressToTool(event: KeyboardEvent) {
        this._state.passKeyPressToTool(event);
    }

    public handleKeyEvent(event: KeyboardEvent) {
        if (document.activeElement && document.activeElement.tagName.toUpperCase() === "INPUT") {
            return;
        }

        if (event.code === "Tab") {
            event.preventDefault();
        }

        if (event.code === AppConfig.Keys.NextStepCode) {
            // Todo: We can now do this here
            // this.fireNextStep();
        } else if (event.code === AppConfig.Keys.DeleteCode) {
            // Todo: We can now do this here
            // this.fireObjectDeleted();
        } else if (event.code === AppConfig.Keys.ObjectSnapCode) {
            event.preventDefault();
            this.selectReferenceObjectForTool();
        } else if (event.code === AppConfig.Keys.AbortToolKeyCode) {
            this._state.switchTool(null);
        } else if (event.key === AppConfig.Keys.DrawCircleKey) {
            this.switchToDrawTool(ToolNames.Circle);
        } else if (event.key === AppConfig.Keys.DrawRectKey) {
            this.switchToDrawTool(ToolNames.Rectangle);
        } else if (event.key === AppConfig.Keys.DrawLineKey) {
            this.switchToDrawTool(ToolNames.Line);
        } else if (event.key === AppConfig.Keys.DrawPolygonKey) {
            this.switchToDrawTool(ToolNames.Polygon);
        } else if (event.key === AppConfig.Keys.DrawQuadricKey) {
            this.switchToDrawTool(ToolNames.Quadric);
        } else if (event.key === AppConfig.Keys.MoveKey) {
            this._state.switchTool(ToolNames.Move);
        } else if (event.key === AppConfig.Keys.RotateKey) {
            this._state.switchTool(ToolNames.Rotate);
        } else if (event.key === AppConfig.Keys.ScaleKey) {
            this._state.switchTool(ToolNames.Scale);
        } else {
            this.passKeyPressToTool(event);
        }
    }
}