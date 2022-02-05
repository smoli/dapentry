import {AppConfig} from "./AppConfig";
import {ToolNames} from "./tools/ToolNames";
import {State} from "./state/State";
import {BaseAction} from "./actions/BaseAction";
import {AddStatement} from "./actions/AddStatement";
import {GfxInterpreter} from "./GfxInterpreter";
import {GrCanvas} from "./geometry/GrCanvas";
import {StyleManager} from "./drawing/StyleManager";

type PerformanceMeasurement = { [key: string]: DOMHighResTimeStamp };

class PerformanceMeasure {
    protected measurements:Array<PerformanceMeasurement> = [];
    protected current:PerformanceMeasurement = null;

    constructor() {
        this.reset();
    }

    reset() {
        this.current = {};
        this.measurements.push(this.current);
    }

    now(key:string) {
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


export class AppController {
    private readonly _state: State;
    private _interpreter: GfxInterpreter;
    private _canvas: GrCanvas = GrCanvas.create_1_1(400);
    private _performance: PerformanceMeasure = new PerformanceMeasure();
    private _styleManager: StyleManager = new StyleManager();

    constructor(state:State,
                interpreter: GfxInterpreter) {
        this._state = state;
        this._interpreter = interpreter;
    }

    get state():State {
        return this._state;
    }

    protected async runCode(): Promise<any> {
        this._interpreter.clearObjects(this._canvas);
        this._performance.reset();
        this._performance.now("start");
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


    protected async execute(action:BaseAction) {
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
                // Todo: We can now do this here
                // this._pumpToTool(InteractionEvents.OtherObject, event);
            } else if (event.keyCode === AppConfig.Keys.AbortToolKeyCode) {
                this._state.switchTool(null);
            } else if (event.key === AppConfig.Keys.DrawCircleKey) {
                this._state.switchTool(ToolNames.Circle);
            } else if (event.key === AppConfig.Keys.DrawRectKey) {
                this._state.switchTool(ToolNames.Rectangle);
            } else if (event.key === AppConfig.Keys.DrawLineKey) {
                this._state.switchTool(ToolNames.Line);
            } else if (event.key === AppConfig.Keys.DrawPolygonKey) {
                this._state.switchTool(ToolNames.Polygon);
            } else if (event.key === AppConfig.Keys.DrawQuadricKey) {
                this._state.switchTool(ToolNames.Quadric);
            } else if (event.key === AppConfig.Keys.MoveKey) {
                this._state.switchTool(ToolNames.Move);
            } else if (event.key === AppConfig.Keys.RotateKey) {
                this._state.switchTool(ToolNames.Rotate);
            } else if (event.key === AppConfig.Keys.ScaleKey) {
                this._state.switchTool(ToolNames.Scale);
            } else {
                // Todo: How to pass key strokes to tools
                // this._pumpToTool(InteractionEvents.Key, event)
            }
    }
}