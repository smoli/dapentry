import Component from "./Component";
import {StyleManager} from "./controls/drawing/Objects/StyleManager";
import {GrObject, ObjectType} from "./controls/drawing/Objects/GrObject";
import Drawing from "./controls/drawing/Drawing";
import {BaseComponentController} from "./BaseComponentController";
import {GfxInterpreter} from "./GfxInterpreter";
import {JSONModelAccess} from "./JSONModelAccess";
import {AddStatement} from "./controller/actions/AddStatement";
import {AddStatements} from "./controller/actions/AddStatements";
import {UpdateStatement} from "./controller/actions/UpdateStatement";
import {ReplaceCode} from "./controller/actions/ReplaceCode";

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
        // this.preloadDemoCode();
    }

    /**
     * TODO: This is hacky
     * @param clearAllFirst
     * @protected
     */
    protected updateDrawing(clearAllFirst: boolean = false) {
        this._drawing.setObjects(this.getAppModel().get("drawing"));
        this._drawing.update(clearAllFirst);
    }

    public updateAll() {
        this.runCode().then(() => {
            if (this._interpreter.lastObjectTouched) {
                this._drawing.selectObject(this._interpreter.lastObjectTouched);
            }
            this.updateDrawing();
        });
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


    public setSelectedCodeLine(line?) {
        if (!line) {
            this.getAppModel().set("selectedCodeLine").to(null);
        } else {
            this.getAppModel().set("selectedCodeLine").to(line);
        }
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
        this.getAppModel().set("drawing").to([]);
        const data = this.getDataFromDataFields();
        this._interpreter.parse(this._component.getCodeManager().code);
        return this._interpreter.run({
            "$drawing": this.getAppModel().get("drawing"),
            "$styles": this._styleManager.styles,
            "$lastObject": null,
            ...data
        });
    }

    getAppModel(): JSONModelAccess {
        return this._component.getAppModel();
    }

    async updateOperation(statementIndex: number, tokenIndex: number, tokenSubIndex: number, newValue: string) {
        await this.execute(new UpdateStatement(this._component, statementIndex, tokenIndex, tokenSubIndex, newValue));
        await this.runCode();
        this.updateDrawing();
    }

    async addOperation(code: string) {
        await this.execute(new AddStatement(this._component, code));
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


    getSelection(): Array<GrObject> {
        return this.getAppModel().get("selection");
    }

    setSelection(selection: Array<GrObject>) {
        let s = [];
        if (selection) {

            s = selection.map(object => {
                return {
                    "name": object.name,
                    "type": ObjectType[object.type],
                    "style": {...object.style},
                    object
                }
            });
        }

        this.getAppModel().set("selection").to(s);
    }

    protected preloadDemoCode(): void {
        const code = `POLY $drawing Polygon2 "Polygon2" $styles.default [ (209 342) (209 371) (238 357) (209 342) ] 1
QUAD $drawing Quadratic4 "Quadratic4" $styles.default [ (238 357) (277 336) (292 353) (285 374) (237 357) ] 1
FILL Polygon2 "#fcff52" 1
FILL Polygon2 "#f7fb04" 1
FILL Quadratic4 "#fff652" 1
FILL Quadratic4 "#faee0f" 1
FILL Quadratic4 "#fcf003" 1
FILL Quadratic4 "#efe30b" 1
FILL Quadratic4 "#fef106" 1
FILL Quadratic4 "#fef325" 1
POLY $drawing Polygon5 "Polygon5" $styles.default [ (266 405) (283 417) (267 431) (268 405) ] 1
FILL Polygon5 "#f00505" 1
QUAD $drawing Quadratic6 "Quadratic6" $styles.default [ (285 417) (330 406) (339 416) (317 430) (284 416) ] 1
FILL Quadratic6 "#ff5452" 1
FILL Quadratic6 "#f00e0a" 1
POLY $drawing Polygon7 "Polygon7" $styles.default [ (338 368) (338 386) (368 374) (335 360) (339 384) ] 1
FILL Polygon7 "#71ff52" 1
FILL Polygon7 "#30f005" 1
QUAD $drawing Quadratic8 "Quadratic8" $styles.default [ (366 372) (409 359) (416 370) (392 385) (369 351) ] 1
FILL Quadratic8 "#52ff5d" 1
FILL Quadratic8 "#06f416" 1
QUAD $drawing Quadratic11 "Quadratic11" $styles.default [ (13 46) (58 77) (155 60) (293 30) (379 58) (478 47) (602 76) (719 53) (770 59) (919 21) ] 1
FILL Quadratic11 "#52fcff" 1
FILL Quadratic11 "#52cbff" 1
QUAD $drawing Quadratic12 "Quadratic12" $styles.default [ (6 657) (44 612) (53 624) (10 667) (12 650) ] 1
QUAD $drawing Quadratic13 "Quadratic13" $styles.default [ (3 626) (32 589) (36 599) (6 633) ] 1
QUAD $drawing Quadratic14 "Quadratic14" $styles.default [ (7 688) (44 669) (53 669) (4 704) ] 1
FILL Quadratic14 "#f80d0d" 1
FILL Quadratic12 "#ff5d52" 1
FILL Quadratic12 "#f41b0b" 1
FILL Quadratic13 "#ff5d52" 1
FILL Quadratic13 "#fb1909" 1
QUAD $drawing Quadratic15 "Quadratic15" $styles.default [ (187 905) (154 848) (167 841) (192 901) ] 1
QUAD $drawing Quadratic16 "Quadratic16" $styles.default [ (198 902) (221 854) (241 850) (203 904) ] 1
QUAD $drawing Quadratic17 "Quadratic17" $styles.default [ (191 874) (193 833) (205 824) (197 882) ] 1
FILL Quadratic17 "#ffffff" 1
FILL Quadratic17 "#f609c3" 1
FILL Quadratic16 "#ff52ee" 1
FILL Quadratic16 "#f005d8" 1
FILL Quadratic15 "#ff52d7" 1
FILL Quadratic15 "#fe0bc5" 1
QUAD $drawing Quadratic18 "Quadratic18" $styles.default [ (690 904) (583 769) (613 759) (706 908) ] 1
QUAD $drawing Quadratic19 "Quadratic19" $styles.default [ (710 903) (649 726) (681 735) (717 904) ] 1
QUAD $drawing Quadratic20 "Quadratic20" $styles.default [ (719 903) (744 717) (758 748) (728 906) ] 1
QUAD $drawing Quadratic21 "Quadratic21" $styles.default [ (673 903) (573 828) (562 847) (667 907) ] 1
QUAD $drawing Quadratic22 "Quadratic22" $styles.default [ (735 906) (782 826) (785 848) (742 905) ] 1
FILL Quadratic21 "#fa4605" 1
FILL Quadratic21 "#e14e19" 1
FILL Quadratic21 "#de4812" 1
FILL Quadratic21 "#f14b0e" 1
FILL Quadratic21 "#ed5821" 1
FILL Quadratic21 "#f8612a" 1
FILL Quadratic18 "#fa6129" 1
FILL Quadratic19 "#f76d3b" 1
FILL Quadratic20 "#f7622b" 1
FILL Quadratic22 "#f26431" 1
POLY $drawing Polygon23 "Polygon23" $styles.default [ (400 476) (400 421) (449 453) (402 476) ] 1
FILL Polygon23 "#ffffff" 1
FILL Polygon23 "#080bd4" 1
QUAD $drawing Quadratic24 "Quadratic24" $styles.default [ (450 451) (489 419) (540 420) (528 467) (448 450) ] 1
FILL Quadratic24 "#525dff" 1
FILL Quadratic24 "#0818f7" 1
QUAD $drawing Quadratic25 "Quadratic25" $styles.default [ (358 903) (336 861) (343 812) (314 755) (324 745) (359 802) (363 882) (373 906) ] 1
FILL Quadratic25 "#ffffff" 1
FILL Quadratic25 "#047116" 1
QUAD $drawing Quadratic26 "Quadratic26" $styles.default [ (374 905) (374 844) (393 813) (382 766) (385 755) (413 779) (395 837) (386 900) ] 1
FILL Quadratic26 "#52ff5a" 1
FILL Quadratic26 "#057f0b" 1
POLY $drawing Polygon28 "Polygon28" $styles.default [ (581 342) (580 372) (609 358) (581 342) ] 1
FILL Polygon28 "#f52424" 1`;

        this.addOperations(code.split("\n").filter(l => !!l));
    }

}