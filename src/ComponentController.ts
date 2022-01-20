import Component from "./Component";
import {StyleManager} from "./controls/drawing/Objects/StyleManager";
import {GrObject, ObjectType} from "./Geo/GrObject";
import Drawing from "./controls/drawing/Drawing";
import {BaseComponentController} from "./BaseComponentController";
import {GfxInterpreter} from "./GfxInterpreter";
import {AddStatement} from "./controller/actions/AddStatement";
import {AddStatements} from "./controller/actions/AddStatements";
import {UpdateStatement} from "./controller/actions/UpdateStatement";
import {ReplaceCode} from "./controller/actions/ReplaceCode";
import {AppModel} from "./model/AppModel";
import {SegmentedCodeLine} from "./SegmentedCodeLine";
import {SelectObjects} from "./controller/actions/SelectObjects";
import {SetSelectedCodeLines} from "./controller/actions/SetSelectedCodeLines";




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
     * TODO: This is hacky
     * @param clearAllFirst
     * @protected
     */
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

        this.getAppModel().set("segmentedCode", c => c.selected, "selected").to(false);
        this.getAppModel().set("segmentedCode", c => c.index === this._interpreter.pc, "selected").to(true);

        this.updateDrawing();
    }

    /**
     * TODO: this is hacky. We need to figure out a way to make the drawing control
     *       actually data driven.
     * @param value
     */
    public set drawing(value: Drawing) {
        this._drawing = value;
        this.runCode().then(() => {
            this.updateDrawing();
        });
    }


    public async setSelectedCodeLines(indexes:  Array<number>) {
        await this.execute(new SetSelectedCodeLines(this._component, indexes))

        if (indexes.length === 0) {
            this._interpreter.clearPauseAfter()
        } else {
            this._interpreter.pauseAfter(Math.max(...indexes));
        }
    }

    public async setSelectedCodeLine(index: number = -1) {
        if (index === -1) {
            await this.execute(new SetSelectedCodeLines(this._component, []))
        } else {
            await this.execute(new SetSelectedCodeLines(this._component, [index]))
        }

        if (index === -1) {
            this._interpreter.clearPauseAfter()
        } else {
            this._interpreter.pauseAfter(index);
        }
        this.runCode().then(() => {
            this.updateDrawing();
        });
    }

    protected getDataFromDataFields() {
        const scope = {};
        const d = this.getAppModel().get("data");

        for (const field of d) {
            scope[field.name] = field.value;
        }

        return scope;
    }



    protected async runCode(): Promise<any> {
        this._interpreter.clearObjects();
        const data = this.getDataFromDataFields();
        this._interpreter.parse(this._component.getCodeManager().code);

        /*
        console.group("Actual Source Code");
        this._component.getCodeManager().code.forEach((c, i) => console.log(i, c));
        console.groupEnd();
        console.group("Code in the interpreter");
        this._interpreter.code.forEach((c, i) => console.log(i, c));
        console.groupEnd();
        console.group("Segmented Code");
        this.getAppModel().get("segmentedCode").forEach((c, i) => console.log(i, c));
        console.groupEnd();*/

        return this._interpreter.run({
            "$styles": this._styleManager.styles,
            "$lastObject": null,
            ...data
        });
    }

    getAppModel(): AppModel {
        return this._component.getAppModel();
    }

    getSelectedCodeLine():SegmentedCodeLine {
        return this.getAppModel().get("selectedCodeLine")
    }

    async updateOperation(statementIndex: number, tokenIndex: number, tokenSubIndex: number, newValue: string) {
        await this.execute(new UpdateStatement(this._component, statementIndex, tokenIndex, tokenSubIndex, newValue));
        await this.runCode();
        this.updateDrawing();
    }

    async addOperation(code: string) {
        const sel = this.getSelectedCodeLine();
        let nextIndex = -1;
        if (sel) {
            nextIndex = sel.index + 1
            await this.execute(new AddStatement(this._component, code, nextIndex));
        } else {
            await this.execute(new AddStatement(this._component, code));
        }

        await this.runCode();
        this.updateDrawing();
        await this.setSelectedCodeLine(nextIndex)
    }

    async addOperations(code: Array<string>) {
        const sel = this.getSelectedCodeLine();
        let nextIndex = -1;
        if (sel) {
            nextIndex = sel.index + 1
            await this.execute(new AddStatements(this._component, code, nextIndex))

        } else {
        await this.execute(new AddStatements(this._component, code))
        }


        if (this._drawing) {
            await this.runCode();
            this.updateDrawing();
        }

        nextIndex = nextIndex + code.length - 1;
        await this.setSelectedCodeLine(nextIndex);
    }

    async replaceCode(code: Array<string>) {
        await this.execute(new ReplaceCode(this._component, code))
        if (this._drawing) {
            await this.runCode();
            this.updateDrawing();
        }
    }


    getSelection(): Array<GrObject> {
        return this.getAppModel().getSelectedObjects();
    }

    async setSelection(selection: Array<GrObject>) {
        await this.execute(new SelectObjects(this._component, selection))
    }

    protected preloadDemoCode(): void {
        return;
        const code = `RECT Rectangle2, $styles.default, (401.5, 560.5), 200, 100
RECT Rectangle1, $styles.default, (401.5, 560.5), 100, 50
RECT Rectangle3, $styles.default, (401.5, 560.5), 200, 100`;

        this.addOperations(code.split("\n").filter(l => !!l));
    }

}
