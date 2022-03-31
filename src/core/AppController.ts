import {AppConfig} from "./AppConfig";
import {ToolNames} from "../tools/ToolNames";
import {State} from "../state/State";
import {BaseAction} from "../actions/BaseAction";
import {AddStatement} from "../actions/AddStatement";
import {GfxInterpreter} from "./GfxInterpreter";
import {GrCanvas} from "../geometry/GrCanvas";
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
import {DialogCloseReason, ModalFactory} from "../ui/core/ModalFactory";
import {LoopStatements} from "../actions/LoopStatements";
import {RenameDataField} from "../actions/RenameDataField";
import {BatchAction} from "../actions/BatchAction";
import {AddStatementToSelection} from "../actions/AddStatementToSelection";
import {DeleteStatements} from "../actions/DeleteStatements";
import {DeleteObjects} from "../actions/DeleteObjects";
import {LibraryEntry} from "./Library";
import {SaveDrawingToLibrary} from "../actions/SaveDrawingToLibrary";
import {Login} from "../actions/Login";
import {API} from "../api/API";
import {AddColumnToDataField} from "../actions/AddColumnToDataField";
import {InterpreterError} from "../runtime/interpreter/errors/InterpreterError";
import {LoadFromLibrary} from "../actions/LoadFromLibrary";
import {InteractionEventKind, InteractionEvents} from "./InteractionEvents";
import {logInteraction} from "./InteractionLogger";
import {AspectRatio} from "../geometry/AspectRatio";
import {RenameTableColumn} from "../actions/RenameTableColumn";
import {LoadFieldFromCSV} from "../actions/LoadFieldFromCSV";
import {PublishDrawing} from "../actions/PublishDrawing";

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
    aspectRatio: AppConfig.Drawing.InitialAspectRatio,
    drawingHeight: AppConfig.Drawing.Height,
    availableTools: Object.values(ToolNames) as Array<ToolNames>,
    poiAvailable: true,
    libraryAvailable: true
}

const toolsThatAllowSelection: Array<ToolNames> = [
    ToolNames.Select, ToolNames.Move, ToolNames.Rotate, ToolNames.Scale, ToolNames.Polygon
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
    private _startupOptions: ApplicationOptions;


    constructor(state: State,
                interpreter: GfxInterpreter,
                options: ApplicationOptions = {},
                modalFactory?: ModalFactory) {
        this._state = state;
        this._interpreter = interpreter;
        this._startupOptions = options;
        this._modalFactory = modalFactory;

        this._processOptions({
            ...applicationDefaults,
            ...options
        })
    }

    protected _processOptions(options: ApplicationOptions) {

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

        this._canvas = GrCanvas.create(options.aspectRatio, this._defaultDrawingHeight);
        this._state.setAspectRatio(options.aspectRatio);
        this._state.setDrawingDimensions(this._canvas.width, this._canvas.height);
    }

    get poiAvailable(): boolean {
        return this._poiAvailable;
    }

    init() {
        this._state.setObjectsOnDrawing([this._canvas]);
    }

    async clearAll() {
        const dialog = this.modalFactory.createConfirmationModal();

        // TODO: Provide a save option
        const result = await dialog.show({
            text: "Create a new drawing? This will remove all current content"
        })

        if (result.reason !== DialogCloseReason.YES) {
            return;
        }

        this.resetAll();
    }

    public resetAll() {
        this.state.resetAll();

        this._processOptions({
            ...applicationDefaults,
            ...this._startupOptions
        });
        this._interpreter.clearObjects(this._canvas);
        this._interpreter.resetGuides();
        this._updateDrawing();
    }

    public async setAspectRatio(ar: AspectRatio) {
        this._canvas = GrCanvas.create(ar, this._defaultDrawingHeight);
        this._state.setDrawingDimensions(this._canvas.width, this._canvas.height);
        this._state.setAspectRatio(ar);

        await this._runCode();
        this._updateDrawing();
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
        await this._runCode();
        this._updateDrawing();
    }

    protected async _runCode(): Promise<any> {
        try {
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
            this._updateSelection();
        } catch (e) {
            console.info("Errors during execution");

            if (!( e instanceof InterpreterError )) {
                throw e;
            }

        } finally {
            this._performance.now("computed");
        }
    }

    /**
     * After the program is run, the selection must be updated
     * as instances changed and maybe some objects are gone.
     * @protected
     */
    protected _updateSelection() {
        const curr = this.state.selection;

        if (curr.length === 0) {
            if (this._interpreter.lastObjectTouched) {
                this.state.selectObject(this._interpreter.lastObjectTouched);
            }
            return;
        }

        const objects = this._interpreter.objects;

        const newSelection = curr.map(old => {
            return objects.find(o => o.uniqueName === old.uniqueName);
        }).filter(o => !!o);

        this.state.deselectAll();
        newSelection.forEach(o => this.state.selectObject(o));
    }

    protected _updateDrawing() {
        this._state.setObjectsOnDrawing(this._interpreter.objects);
    }

    protected async _execute(action: BaseAction) {
        action.controller = this;
        return await action.execute(null);
    }

    protected async _executeBatch(...actions: Array<BaseAction>) {
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
        this._updateDrawing();
    }

    async setLocale(locale: string) {
        this.state.setLocale(locale);
        await this.save();
    }

    async addNewDataField(value: DataFieldValue) {
        await this._execute(new AddNewDataField(value));
    }

    async removeDataField(name: string) {
        await this._execute(new RemoveDataField(name));
        await this._runCode();
        this._updateDrawing();
    }


    async setDataFieldValue(name: string, newValue: DataFieldValue): Promise<Array<Error>> {
        this.state.setDataFieldValue(name, newValue);
        await this._runCode();

        if (this._interpreter.errors.length === 0) {
            this._updateDrawing();
            await this._persistence?.saveCode();
        } else {
            return this._interpreter.errors;
        }
    }

    async setDataListFieldValue(name: string, index: number, value: DataFieldValue) {
        this.state.setDataListFieldValue(name, index, value);
        await this._runCode();
        this._updateDrawing();
        await this._persistence?.saveCode();
    }

    async setDataTableCellValue(name: string, index: number, column: string, value: DataFieldValue) {
        this.state.setDataTableCellValue(name, index, column, value);
        await this._runCode();
        this._updateDrawing();
        await this._persistence?.saveCode();
    }

    async loadFieldFromCSV(name: string, csvString: string) {
        await this._execute(new LoadFieldFromCSV(name, csvString));
        await this._runCode();
        this._updateDrawing();
    }

    async addValueToDataField(name: string, value: ( number | string )) {
        await this._execute(new AddValueToDataField(name, value));
        await this._runCode();
        this._updateDrawing();
    }

    async addColumnToDataField(name: string, value: ( number | string )) {
        await this._execute(new AddColumnToDataField(name, value));
        await this._runCode();
        this._updateDrawing();
    }

    async renameDataField(oldName: string, newName: string) {
        await this._execute(new RenameDataField(oldName, newName));
        await this._runCode();
        this._updateDrawing();
    }

    async renameTableColumn(registerName:string, oldColumnName: string, newColumnName: string) {
        await this._execute(new RenameTableColumn(registerName, oldColumnName, newColumnName));
        await this._runCode();
        this._updateDrawing();
    }

    async addStatement(code: string) {
        if (code === null) {
            return;
        }
        if (this.state.codeSelection?.length) {
            const newIndex = Math.max(...this.state.codeSelection) + 1;
            await this._executeBatch(
                new AddStatement([code]),
                new AddStatementToSelection(newIndex)
            );
        } else {
            await this._execute(new AddStatement([code]));
        }

        await this._runCode();
        this._updateDrawing();
        await this._persistence?.saveCode();
    }

    async addStatements(code: Array<string>) {
        if (code.length === 0) {
            return;
        }
        await this._execute(new AddStatement(code));
        await this._runCode();
        this._updateDrawing();
        await this._persistence?.saveCode();
    }

    async setCode(code: string) {
        await this._execute(new AddStatement(code.split("\n")
            .map(c => c.trim())
            .filter(c => c.length !== 0)));
        await this._runCode();
        this._updateDrawing();
        await this._persistence?.saveCode();
    }

    async deleteStatements(index: number) {
        this.state.clearCodeSelection();
        this.state.deselectAll();
        await this._execute(new DeleteStatements(index));
        await this._runCode();
        this._updateDrawing();
        await this._persistence?.saveCode();
    }

    async deleteSelectedObjects() {
        if (this.state.selection.length === 0) {
            return;
        }
        this.state.clearCodeSelection();
        const toDelete = [...this.state.selection];
        this.state.deselectAll();
        await this._execute(new DeleteObjects(toDelete));
        await this._runCode();
        this._updateDrawing();
        await this._persistence?.saveCode();
    }

    async updateStatement(statementIndex: number, tokenIndexes: Array<number>, newValue: string): Promise<Array<Error>> {
        const oldStatement = this._state.store.state.code.code[statementIndex];

        const result = await this._execute(new UpdateStatement(statementIndex, tokenIndexes, newValue));

        if (result?.errors?.length) {
            return result.errors;
        }

        await this._runCode();

        if (this._interpreter.errors.length === 0) {
            this._updateDrawing();
            await this._persistence?.saveCode();
        } else {
            this.state.replaceStatement(statementIndex, oldStatement);
        }

        return this._interpreter.errors;
    }

    async loopStatements(statementIndexes: Array<number>) {
        await this._execute(new LoopStatements(statementIndexes));
        await this._runCode();
        this._updateDrawing();
        await this._persistence?.saveCode();
    }

    async clearStatementSelection() {
        this._state.clearCodeSelection();
        await this._runCode();
        this._updateDrawing();
    }

    async selectStatement(index: number) {
        this._state.setCodeSelection([index]);
        await this._runCode();
        this._updateDrawing();
    }

    async selectStatements(indexes: Array<number>) {
        this._state.setCodeSelection(indexes);
        await this._runCode();
        this._updateDrawing();
    }

    public async setFillColorForSelection(value: string) {
        await this._execute(new SetFillColor(this.state.selection, value));
        await this._runCode();
        this._updateDrawing()
    }

    public async setFillOpacityForSelection(value: number) {
        await this._execute(new SetFillOpacity(this.state.selection, value));
        await this._runCode();
        this._updateDrawing()
    }

    public async setStrokeColorForSelection(value: string) {
        await this._execute(new SetStrokeColor(this.state.selection, value));
        await this._runCode();
        this._updateDrawing()
    }

    public async setStrokeWidthForSelection(value: number) {
        await this._execute(new SetStrokeWidth(this.state.selection, value));
        await this._runCode();
        this._updateDrawing()
    }

    public handleObjectSelection(object: GrObject) {

        const currentTool = this._state.store.state.tool.current;

        if (currentTool && !toolsThatAllowSelection.includes(currentTool)) {
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

    public markObjectAsGuide(name: string) {
        this._interpreter.markObjectAsGuide(name);
    }

    public async makeSelectedObjectsGuides() {
        let rerun = false;
        this._state.selection.forEach(o => {
            if (o.type === ObjectType.Composite) {
                return;
            }

            o.markAsGuide(!o.isGuide);
            this._interpreter.markObjectAsGuide(o.uniqueName, o.isGuide);
            if (o.type === ObjectType.List) {
                rerun = true;
            }
        });
        if (rerun) {
            await this._runCode()
        }
        this._updateDrawing();
    }

    public switchTool(newTool: ToolNames, ...params: Array<any>) {
        if (!toolsThatAllowSelection.find(t => t === newTool)) {
            // It's a draw tool
            this.state.deselectAll();
        }

        this._state.switchTool(newTool, ...params);
    }

    public switchToInsertLibraryEntryTool(entry: LibraryEntry) {
        this.switchTool(ToolNames.Instance, entry);
    }

    protected _selectReferenceObjectForTool() {
        const current = this.state.referenceObjectForTool;
        const objects = this.state.objects;
        let i = current ? objects.indexOf(current) : -1;
        i += 1;

        while (i < objects.length) {
            const next = objects[i];
            // if (!this.state.isObjectSelected(next) && !( next instanceof GrCanvas )) {
            if (!( next instanceof GrCanvas )) {
                this.state.setReferenceObjectForTool(next);
                return;
            }

            i += 1;
        }
        this.state.setReferenceObjectForTool(null);
    }

    protected _passKeyPressToTool(event: KeyboardEvent) {
        this._state.passKeyPressToTool(event);
    }


    protected async _cancelTool() {
        this._state.switchTool(null);
        await this._runCode();
        this._updateDrawing();
    }

    public async handleKeyEvent(event: KeyboardEvent) {

        if (document.activeElement && document.activeElement.tagName.toUpperCase() === "INPUT") {
            return;
        }

        if (event.code === "Tab") {
            event.preventDefault();
        }

        if (event.code === AppConfig.Keys.NextStepCode) {
            event.stopPropagation();
            event.preventDefault();
            await this.nextStep();
        } else if (event.code === AppConfig.Keys.DeleteCode) {
            await this.deleteSelectedObjects();
        } else if (event.code === AppConfig.Keys.ObjectSnapCode) {
            event.preventDefault();
            this._selectReferenceObjectForTool();
        } else if (event.code === AppConfig.Keys.AbortToolKeyCode) {
            await this._cancelTool();
        } else if (event.key === AppConfig.Keys.DrawCircleKey) {
            this.switchTool(ToolNames.Circle);
        } else if (event.key === AppConfig.Keys.DrawRectKey) {
            this.switchTool(ToolNames.Rectangle);
        } else if (event.key === AppConfig.Keys.DrawLineKey) {
            this.switchTool(ToolNames.Line);
        } else if (event.key === AppConfig.Keys.DrawTextKey) {
            this.switchTool(ToolNames.Text);
        } else if (event.key === AppConfig.Keys.DrawPolygonKey) {
            this.switchTool(ToolNames.Polygon);
        } else if (event.key === AppConfig.Keys.DrawQuadricKey) {
            this.switchTool(ToolNames.Quadric);
        } else if (event.key === AppConfig.Keys.MoveKey) {
            this._state.switchTool(ToolNames.Move);
        } else if (event.key === AppConfig.Keys.RotateKey) {
            this._state.switchTool(ToolNames.Rotate);
        } else if (event.key === AppConfig.Keys.ScaleKey) {
            this._state.switchTool(ToolNames.Scale);
        } else if (event.key === AppConfig.Keys.MarkAsGuideKey) {
            this.makeSelectedObjectsGuides();
        } else {
            this._passKeyPressToTool(event);
        }

    }

    get modalFactory(): ModalFactory {
        if (!this._modalFactory) {
            this._modalFactory = new ModalFactory(this.state);
        }
        return this._modalFactory;
    }

    public async saveDrawingToLibrary() {
        await this._execute(new SaveDrawingToLibrary());
    }

    public async publishDrawing() {
        await this._execute(new PublishDrawing());
    }

    public async loadDrawingFromLibrary(entryName: string) {
        await this.clearStatementSelection();
        await this.state.deselectAll();
        await this._execute(new LoadFromLibrary(entryName));
        await this._runCode();
        this._updateDrawing();
    }

    public async logout() {
        if (!this._state.store.state.auth.authenticated) {
            return;
        }
        this._state.logout();
        this._state.clearLibrary();
        this._persistence.removeAuthToken();
    }

    public async login() {
        if (this._state.store.state.auth.authenticated) {
            return;
        }

        await this._execute(new Login());

        if (this._state.store.state.auth.authenticated) {
            API.setAuthInfo(this._state.store.state.auth.token)
            await this._persistence.load(this.state);
        }
    }

    public toggleLibrary() {
        if (this._startupOptions.libraryAvailable) {
            this._state.toggleLibrary();
            this._persistence.saveLayout();
        }
    }

    public toggleToolbar() {
        this._state.toggleToolbar();
        this._persistence.saveLayout();
    }

    public toggleLeftPanel() {
        this._state.toggleLeftPanel();
        this._persistence.saveLayout();
    }

    public toggleRightPanel() {
        this._state.toggleRightPanel();
        this._persistence.saveLayout();
    }

    public toggleHeader() {
        this._state.toggleHeader();
        this._persistence.saveLayout();
    }

    public toggleToolHints() {
        this._state.toggleToolHints();
        this._persistence.saveLayout();
    }

    public toggleFooter() {
        this._state.toggleFooter();
        this._persistence.saveLayout();
    }


}