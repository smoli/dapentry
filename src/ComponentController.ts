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




export class ComponentController extends BaseComponentController {
    private readonly _component: Component;
    private _interpreter: GfxInterpreter;
    private _styleManager: StyleManager;
    private _drawing: Drawing;

    constructor(component: Component) {
        super();

        this._component = component;
        this._styleManager = new StyleManager();
        this._interpreter = new GfxInterpreter();
        this.preloadDemoCode();
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

        if (this._interpreter.stopped) {
            return;
        }

        const segmentedCode = this.getAppModel().get("segmentedCode");
        await this._interpreter.next()
        let max = 100;
        while ((max--) && !segmentedCode.find(c => c.index === this._interpreter.pc)) {

            if (this._interpreter.stopped) {
                break;
            }
            await this._interpreter.next();
        }

        this.getAppModel().setSelectedCodeLines([this._interpreter.pc]);

        this.updateDrawing();
    }


    public async setSelectedCodeLines(indexes: Array<number> = []) {
        await this.execute(new SetSelectedCodeLines(this._component, indexes))
        this.updateAll();
    }


    protected async runCode(): Promise<any> {
        this._interpreter.clearObjects();
        this._interpreter.parse(this.getAppModel().fullCode);

        const index = this.getAppModel().getLastSelectedCodeLineIndex();

        if (index !== -1) {
            this._interpreter.pauseAfter(index + this.getAppModel().scopeCodeLength);
        } else {
            this._interpreter.clearPauseAfter();
        }

        return this._interpreter.run({
            "$styles": this._styleManager.styles,
            "$lastObject": null
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
        const code = `MAKE sun1, $styles`;

        this.addOperations(code.split("\n").filter(l => !!l));
    }

}
