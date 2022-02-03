import Component from "./Component";
import {StyleManager} from "./controls/drawing/Objects/StyleManager";
import {GrObject} from "./Geo/GrObject";
import Drawing from "./controls/drawing/Drawing";
import {BaseComponentController} from "./BaseComponentController";
import {GfxInterpreter} from "./GfxInterpreter";
import {AddStatements} from "./controller/actions/AddStatements";
import {UpdateStatement} from "./controller/actions/UpdateStatement";
import {ReplaceCode} from "./controller/actions/ReplaceCode";
import {AppModel} from "./model/AppModel";
import {SelectObjects} from "./controller/actions/SelectObjects";
import {SetSelectedCodeLines} from "./controller/actions/SetSelectedCodeLines";
import {DeleteSelection} from "./controller/actions/DeleteSelection";
import {WrapInLoop} from "./controller/actions/WrapInLoop";
import {AspectRatio, GrCanvas} from "./Geo/GrCanvas";
import {LibraryEntry} from "./Library";
import {AppConfig} from "./AppConfig";
import {AppState, SelectionInfo} from "./model/AppState";



type PerformanceMeasurement = { [key: string]: DOMHighResTimeStamp };

class PerformanceMeasure {
    protected measurements:Array<PerformanceMeasurement> = [];
    protected current = null;

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

export class ComponentController extends BaseComponentController {
    private readonly _component: Component;
    private _interpreter: GfxInterpreter;
    private _styleManager: StyleManager;
    private _drawing: Drawing;
    private _canvas: GrCanvas;

    private _performance: PerformanceMeasure = new PerformanceMeasure();

    constructor(component: Component, canvas) {
        super();

        this._component = component;
        this._styleManager = new StyleManager();
        this._interpreter = new GfxInterpreter(component.getLibrary());
        this._canvas = canvas;
        this.preloadDemoCode();
    }

    public setAspectRatio(ar: AspectRatio) {
        switch (ar) {
            case AspectRatio.ar1_1:
                this._canvas = GrCanvas.create_1_1(1000);
                break;
            case AspectRatio.ar3_2:
                this._canvas = GrCanvas.create_3_2(1000);
                break;
            case AspectRatio.ar4_3:
                this._canvas = GrCanvas.create_4_3(1000);
                break;
            case AspectRatio.ar16_9:
                this._canvas = GrCanvas.create_16_9(1000);
                break;
            case AspectRatio.ar16_10:
                this._canvas = GrCanvas.create_16_10(1000);
                break;

        }

        if (this._drawing) {
            this._drawing.setCanvas(this._canvas);
        }

        this.updateAll();
    }


    /**
     * In the end this is way more efficient than making the drawing control
     * truly data driven.
     * @param value
     */
    public set drawing(value: Drawing) {
        this._drawing = value;
        this.runCode().then(() => {
            this.updateDrawing();
        });
        this._drawing.setCanvas(this._canvas);
    }

    protected updateDrawing(clearAllFirst: boolean = false) {
        this._drawing.setObjects(this._interpreter.objects);
        this._drawing.update(clearAllFirst);
        if (this._interpreter.lastObjectTouched) {
            this._drawing.selectObject(this._interpreter.lastObjectTouched);
        }
        this._performance.now("drawn");
        this._performance.print();
    }


    public updateAll() {
        this.runCode().then(() => {
            this.updateDrawing();
        });
    }

    public async nextStep() {

        // We prepend the code with code that loads the scope, so we can use expression in the data declarations
        const offset = this.getAppState().scopeCodeLength;

        if (this._interpreter.stopped) {
            return;
        }

        const segmentedCode = this.getAppState().getSegmentedCode();
        await this._interpreter.next()
        let max = 100;
        while ((max--) && !segmentedCode.find(c => c.index + offset === this._interpreter.pc)) {

            if (this._interpreter.stopped) {
                break;
            }
            await this._interpreter.next();
        }

        this.getAppState().setSelectedCodeLines([this._interpreter.pc - offset]);

        this.updateDrawing();
    }


    public async setSelectedCodeLines(indexes: Array<number> = []) {
        await this.execute(new SetSelectedCodeLines(this._component, indexes))
        this.updateAll();
    }


    protected async runCode(): Promise<any> {
        this._interpreter.clearObjects(this._canvas);
        this._performance.reset();
        this._performance.now("start");
        this._interpreter.parse(this.getAppState().fullCode);
        this._performance.now("parsed");

        const index = this.getAppState().getLastSelectedCodeLineIndex();

        if (index !== -1) {
            this._interpreter.pauseAfter(index + this.getAppState().scopeCodeLength);
        } else {
            this._interpreter.clearPauseAfter();
        }

        await this._interpreter.run({
            [AppConfig.Runtime.styleRegisterName]: this._styleManager.styles,
            "$lastObject": null,
            [this._canvas.name]: this._canvas
        });
        this._performance.now("computed");
        return Promise.resolve();
    }

    getAppState(): AppState {
        return this._component.getAppState();
    }

    async updateOperation(statementIndex: number, tokenIndex: number, tokenSubIndex: number, newValue: string) {
        await this.execute(new UpdateStatement(this._component, statementIndex, tokenIndex, tokenSubIndex, newValue));
        await this.runCode();
        this.updateDrawing();
    }

    async addOperation(code: string) {
        await this.execute(new AddStatements(this._component, [code]));
        await this.runCode();
        this.updateDrawing();
    }

    async addOperations(code: Array<string>) {
        await this.execute(new AddStatements(this._component, code))

        if (this._drawing) {
            await this.runCode();
            this.updateDrawing();
        }
    }

    async previewOperation(code: string) {
        this.getAppState().setOperationPreview(code);
    }

    async clearOperationPreview() {
        this.getAppState().clearOperationPreview();
    }

    async replaceCode(code: Array<string>) {
        await this.execute(new ReplaceCode(this._component, code))
        if (this._drawing) {
            await this.runCode();
            this.updateDrawing();
        }
    }


    getSelection(): Array<SelectionInfo> {
        return this.getAppState().getSelectedObjects();
    }

    async wrapSelectionInLoop() {
        await this.execute(new WrapInLoop(this._component));
        if (this._drawing) {
            await this.runCode();
            this.updateDrawing();
        }
    }

    async deleteSelection() {
        await this.execute(new DeleteSelection(this._component))
        if (this._drawing) {
            await this.runCode();
            this.updateDrawing();
        }
    }

    async setSelection(selection: Array<GrObject>) {
        await this.execute(new SelectObjects(this._component, selection))
    }

    insertLibraryEntry(entry: LibraryEntry) {
        this._drawing.startToolInsertLibraryEntry(entry);
    }

    protected preloadDemoCode(): void {
        return;
        const code = `POLY Polygon2, $styles.default, [ (215.58274841308594, 220.28851318359375), (795.9611206054688, 257.9346923828125), (800.6668701171875, 632.8276977539062), (518.3206176757812, 753.609130859375), (695.5713500976562, 519.8892211914062), (439.8911437988281, 654.7879638671875), (541.8494873046875, 414.793701171875), (374.0103454589844, 386.55908203125), (303.4237976074219, 789.6867065429688), (615.5732421875, 830.4700927734375), (562.2411499023438, 924.5855102539062), (262.64044189453125, 949.6829223632812), (43.03783416748047, 847.7245483398438), (182.64234924316406, 555.966796875), (110.48721313476562, 458.7142028808594), (173.23081970214844, 315.9725036621094) ], 1
ROTATE Polygon2, 46.71673220901628, Polygon2@center
SCALE Polygon2, 1, 0.75, "bottom"`;

        // const code = 'CIRCLE Circle1, ${AppConfig.Runtime.defaultStyleRegisterName}, Canvas@center, f2 * 50';
        // const code = `MAKE sun1, "star", ${AppConfig.Runtime.XXXXXXXXXXX}, 400, Canvas@center`;
        /*
        const code = `RECT Rectangle1, ${AppConfig.Runtime.defaultStyleRegisterName}, (279, 525), 20, 82
        DO 2
        RECT Rectangle2, ${AppConfig.Runtime.defaultStyleRegisterName}, (400, 525), 168, 82
        MOVE Rectangle2@bottom, Rectangle2@top
        ENDDO`
        */
        this.addOperations(code.split("\n").filter(l => !!l));
    }

}
