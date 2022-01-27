import Component from "./Component";
import {StyleManager} from "./controls/drawing/Objects/StyleManager";
import {GrObject} from "./Geo/GrObject";
import Drawing from "./controls/drawing/Drawing";
import {BaseComponentController} from "./BaseComponentController";
import {GfxInterpreter} from "./GfxInterpreter";
import {AddStatements} from "./controller/actions/AddStatements";
import {UpdateStatement} from "./controller/actions/UpdateStatement";
import {ReplaceCode} from "./controller/actions/ReplaceCode";
import {AppModel, SelectionInfo} from "./model/AppModel";
import {SelectObjects} from "./controller/actions/SelectObjects";
import {SetSelectedCodeLines} from "./controller/actions/SetSelectedCodeLines";
import {DeleteSelection} from "./controller/actions/DeleteSelection";
import {WrapInLoop} from "./controller/actions/WrapInLoop";
import {AspectRatio, GrCanvas} from "./Geo/GrCanvas";


export class ComponentController extends BaseComponentController {
    private readonly _component: Component;
    private _interpreter: GfxInterpreter;
    private _styleManager: StyleManager;
    private _drawing: Drawing;
    private _canvas: GrCanvas;

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
    }


    public updateAll() {
        this.runCode().then(() => {
            this.updateDrawing();
        });
    }

    public async nextStep() {

        // We prepend the code with code that loads the scope, so we can use expression in the data declarations
        const offset = this.getAppModel().scopeCodeLength;

        if (this._interpreter.stopped) {
            return;
        }

        const segmentedCode = this.getAppModel().get("segmentedCode");
        await this._interpreter.next()
        let max = 100;
        while ((max--) && !segmentedCode.find(c => c.index + offset === this._interpreter.pc)) {

            if (this._interpreter.stopped) {
                break;
            }
            await this._interpreter.next();
        }

        this.getAppModel().setSelectedCodeLines([this._interpreter.pc - offset]);

        this.updateDrawing();
    }


    public async setSelectedCodeLines(indexes: Array<number> = []) {
        await this.execute(new SetSelectedCodeLines(this._component, indexes))
        this.updateAll();
    }


    protected async runCode(): Promise<any> {
        this._interpreter.clearObjects(this._canvas);
        this._interpreter.parse(this.getAppModel().fullCode);

        const index = this.getAppModel().getLastSelectedCodeLineIndex();

        if (index !== -1) {
            this._interpreter.pauseAfter(index + this.getAppModel().scopeCodeLength);
        } else {
            this._interpreter.clearPauseAfter();
        }

        return this._interpreter.run({
            "$styles": this._styleManager.styles,
            "$lastObject": null,
            [this._canvas.name]: this._canvas
        });
    }

    getAppModel(): AppModel {
        return this._component.getAppModel();
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

    async replaceCode(code: Array<string>) {
        await this.execute(new ReplaceCode(this._component, code))
        if (this._drawing) {
            await this.runCode();
            this.updateDrawing();
        }
    }


    getSelection(): Array<SelectionInfo> {
        return this.getAppModel().getSelectedObjects();
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

    protected preloadDemoCode(): void {

        const code = `DO 2
MAKE sun1, "star", $styles, 400
ENDDO`;
/*
const code = `RECT Rectangle1, $styles.default, (279, 525), 20, 82
DO 2
RECT Rectangle2, $styles.default, (400, 525), 168, 82
MOVE Rectangle2@bottom, Rectangle2@top
ENDDO`
*/
        this.addOperations(code.split("\n").filter(l => !!l));
    }

}
