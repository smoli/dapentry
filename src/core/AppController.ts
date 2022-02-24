import {AppConfig} from "./AppConfig";
import {ToolNames} from "../tools/ToolNames";
import {State} from "../state/State";
import {BaseAction} from "../actions/BaseAction";
import {AddStatement} from "../actions/AddStatement";
import {GfxInterpreter} from "./GfxInterpreter";
import {AspectRatio, GrCanvas} from "../geometry/GrCanvas";
import {StyleManager} from "./StyleManager";
import {GrObject, ObjectType} from "../geometry/GrObject";
import {SetFillColor} from "../actions/SetFillColor";
import {SetFillOpacity} from "../actions/SetFillOpacity";
import {SetStrokeColor} from "../actions/SetStrokeColor";
import {SetStrokeWidth} from "../actions/SetStrokeWidth";
import {Persistence} from "../state/Persistence";
import {UpdateStatement} from "../actions/UpdateStatement";
import {DataFieldValue} from "../state/modules/Data";
import {AddValueToDataField} from "../actions/AddValueToDataField";
import {AddNewDataField} from "../actions/AddNewDataField";
import {RemoveDataField} from "../actions/RemoveDataField";
import {ModalFactory} from "../ui/core/ModalFactory";
import {LoopStatements} from "../actions/LoopStatements";
import {RenameDataField} from "../actions/RenameDataField";
import {BatchAction} from "../actions/BatchAction";
import {AddStatementToSelection} from "../actions/AddStatementToSelection";
import {DeleteStatements} from "../actions/DeleteStatements";
import {DeleteObjects} from "../actions/DeleteObjects";
import {LibraryEntry} from "./Library";

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
    drawingHeight?: number,
    availableTools?: Array<ToolNames>,
    poiAvailable?: boolean,
    libraryAvailable?: boolean
}

export const applicationDefaults: ApplicationOptions = {
    aspectRatio: AspectRatio.ar1_1,
    drawingHeight: 1000,
    availableTools: Object.values(ToolNames) as Array<ToolNames>,
    poiAvailable: true,
    libraryAvailable: true
}

const toolsThatAllowSelection:Array<ToolNames> = [
    ToolNames.Select, ToolNames.Move, ToolNames.Rotate, ToolNames.Scale
];


export class AppController {
    private readonly _state: State;
    private _interpreter: GfxInterpreter;
    private _canvas: GrCanvas;
    private _performance: PerformanceMeasure = new PerformanceMeasure();
    private _styleManager: StyleManager = new StyleManager();
    private _persistence: Persistence;
    private _poiAvailable: boolean;
    private _modalFactory: ModalFactory;
    private _defaultDrawingHeight: number;

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

    protected processOptions(options: ApplicationOptions) {
        this._canvas = GrCanvas.create(options.aspectRatio, options.drawingHeight);

        const tools = [...options.availableTools];
        if (tools.indexOf(ToolNames.Select) === -1) {
            tools.push(ToolNames.Select);
        }
        if (tools.indexOf(ToolNames.None) === -1) {
            tools.push(ToolNames.None);
        }

        this._state.setAvailableTools(tools);

        this._poiAvailable = options.poiAvailable;
        this._defaultDrawingHeight = options.drawingHeight;
    }

    get poiAvailable(): boolean {
        return this._poiAvailable;
    }

    init() {
        this._state.setObjectsOnDrawing([this._canvas]);
    }

    public async setAspectRatio(ar: AspectRatio) {
        this._canvas = GrCanvas.create(ar, this._defaultDrawingHeight);
        this._state.setDrawingDimensions(this._canvas.width, this._canvas.height);
        this._state.setAspectRatio(ar);

        await this.runCode();
        this.updateDrawing();
    }

    get state(): State {
        return this._state;
    }

    public async save(): Promise<any> {
        await this._persistence?.saveAll();
    }

    public async load(persistence: Persistence): Promise<any> {
        this._persistence = persistence;
        await persistence.load(this.state);
        await this.runCode();
        this.updateDrawing();
    }

    protected async runCode(): Promise<any> {
        this._interpreter.clearObjects(this._canvas);
        this._performance.reset();
        this._performance.now("start");
        this._interpreter.parse(this.state.fullCode);
        this._performance.now("parsed");

        const codeSelection = this._state.store.state.code.selectedLines;
        if (codeSelection.length) {
            const index = Math.max(...codeSelection);
            this._interpreter.pauseAfter(index + this._state.dataCodeLength);
        } else {
            this._interpreter.clearPauseAfter();
        }

        await this._interpreter.run({
            [AppConfig.Runtime.styleRegisterName]: this._styleManager.styles,
            "$lastObject": null,
            [this._canvas.name]: this._canvas
        });
        this._performance.now("computed");
        this.updateSelection();
    }

    /**
     * After the program is run, the selection must be updated
     * as instances changed and maybe some objects are gone.
     * @protected
     */
    protected updateSelection() {
        const curr = this.state.selection;
        const objects = this._interpreter.objects;

        const newSelection = curr.map(old => {
            return objects.find(o => o.uniqueName === old.uniqueName);
        }).filter(o => !!o);

        this.state.deselectAll();
        newSelection.forEach(o => this.state.selectObject(o));
    }

    protected updateDrawing() {
        this._state.setObjectsOnDrawing(this._interpreter.objects);
    }

    protected async execute(action: BaseAction) {
        action.controller = this;
        await action.execute(null);
    }

    protected async executeBatch(...actions: Array<BaseAction>) {
        actions.forEach(a => a.controller = this);
        const batch = new BatchAction(...actions);
        await batch.execute(null);
    }

    async nextStep() {
        if (this.state.codeSelection.length === 0) {
            return;
        }

        if (!this._interpreter.stopped) {
            const a = this.state.store.state.code.codeManager.annotatedCode.map(a => a.originalLine);
            const offset = this.state.dataCodeLength;

            await this._interpreter.next();
            let max = 100;
            while (!this._interpreter.stopped &&
            max-- &&
            a.indexOf(this._interpreter.pc - offset) === -1) {
                await this._interpreter.next();
            }

            this._state.setCodeSelection([this._interpreter.pc - this.state.dataCodeLength]);
        }
        this.updateDrawing();
    }

    async setLocale(locale: string) {
        this.state.setLocale(locale);
        await this.save();
    }

    async addNewDataField(value: DataFieldValue) {
        await this.execute(new AddNewDataField(value));
    }

    async removeDataField(name: string) {
        await this.execute(new RemoveDataField(name));
        await this.runCode();
        this.updateDrawing();
    }


    async setDataFieldValue(name: string, newValue: DataFieldValue) {
        this.state.setDateFieldValue(name, newValue);
        await this.runCode();
        this.updateDrawing();
        await this._persistence?.saveCode();
    }

    async setDataListFieldValue(name: string, index: number, value: DataFieldValue) {
        this.state.setDataListFieldValue(name, index, value);
        await this.runCode();
        this.updateDrawing();
        await this._persistence?.saveCode();
    }

    async addValueToDataField(name: string, value: ( number | string )) {
        await this.execute(new AddValueToDataField(name, value));
        await this.runCode();
        this.updateDrawing();
    }

    async renameDataField(oldName: string, newName: string) {
        await this.execute(new RenameDataField(oldName, newName));
        await this.runCode();
        this.updateDrawing();
    }

    async addStatement(code: string) {
        if (code === null) {
            return;
        }
        if (this.state.codeSelection?.length) {
            const newIndex = Math.max(...this.state.codeSelection) + 1;
            await this.executeBatch(
                new AddStatement([code]),
                new AddStatementToSelection(newIndex)
            );
        } else {
            await this.execute(new AddStatement([code]));
        }

        await this.runCode();
        this.updateDrawing();
        await this._persistence?.saveCode();
    }

    async addStatements(code: Array<string>) {
        if (code.length === 0) {
            return;
        }
        await this.execute(new AddStatement(code));
        await this.runCode();
        this.updateDrawing();
        await this._persistence?.saveCode();
    }

    async setCode(code: string) {
        await this.execute(new AddStatement(code.split("\n")
            .map(c => c.trim())
            .filter(c => c.length !== 0)));
        await this.runCode();
        this.updateDrawing();
        await this._persistence?.saveCode();
    }

    async deleteStatements(index: number) {
        this.state.clearCodeSelection();
        await this.execute(new DeleteStatements(index));
        await this.runCode();
        this.updateDrawing();
        await this._persistence?.saveCode();
    }

    async deleteSelectedObjects() {
        if (this.state.selection.length === 0) {
            return;
        }
        this.state.clearCodeSelection();
        const toDelete = [...this.state.selection];
        this.state.deselectAll();
        await this.execute(new DeleteObjects(toDelete));
        await this.runCode();
        this.updateDrawing();
        await this._persistence?.saveCode();
    }

    async updateStatement(statementIndex: number, tokenIndexes: Array<number>, newValue: string) {
        await this.execute(new UpdateStatement(statementIndex, tokenIndexes, newValue));
        await this.runCode();
        this.updateDrawing();
        await this._persistence?.saveCode();
    }

    async loopStatements(statementIndexes: Array<number>) {
        await this.execute(new LoopStatements(statementIndexes));
        await this.runCode();
        this.updateDrawing();
        await this._persistence?.saveCode();
    }

    async clearStatementSelection() {
        this._state.clearCodeSelection();
        await this.runCode();
        this.updateDrawing();
    }

    async selectStatement(index: number) {
        this._state.setCodeSelection([index]);
        await this.runCode();
        this.updateDrawing();
    }

    async selectStatements(indexes: Array<number>) {
        this._state.setCodeSelection(indexes);
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

        const currentTool = this._state.store.state.tool.current;

        if (!toolsThatAllowSelection.includes(currentTool)) {
            return;
        }

        if (!object.isSelectable) {
            return;
        }

        if (object.type === ObjectType.Canvas) {
            this.state.deselectAll();
            return;
        }

        if (this.state.isObjectSelected(object)) {
            this.state.deselectObject(object);
        } else {
            this.state.deselectAll();
            this.state.selectObject(object);
        }
    }

    public switchTool(newTool: ToolNames, ...params: Array<any>) {
        this._state.switchTool(newTool, ...params);
    }

    protected switchToDrawTool(newTool: ToolNames) {
        this.switchTool(newTool);
    }

    public switchToInsertLibraryEntryTool(entry: LibraryEntry) {
        this.switchTool(ToolNames.Instance, entry);
    }

    protected selectReferenceObjectForTool() {
        const current = this.state.referenceObjectForTool;
        const objects = this.state.objects;
        let i = current ? objects.indexOf(current) : -1;
        i += 1;

        while (i < objects.length) {
            const next = objects[i];
            if (!this.state.isObjectSelected(next) && !( next instanceof GrCanvas )) {
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

    public async handleKeyEvent(event: KeyboardEvent) {
        if (document.activeElement && document.activeElement.tagName.toUpperCase() === "INPUT") {
            return;
        }

        if (event.code === "Tab") {
            event.preventDefault();
        }

        if (event.code === AppConfig.Keys.NextStepCode) {
            await this.nextStep();
        } else if (event.code === AppConfig.Keys.DeleteCode) {
            await this.deleteSelectedObjects();
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
        } else if (event.key === AppConfig.Keys.DrawTextKey) {
            this.switchToDrawTool(ToolNames.Text);
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

    get modalFactory(): ModalFactory {
        if (!this._modalFactory) {
            this._modalFactory = new ModalFactory(this.state);
        }
        return this._modalFactory;
    }
}