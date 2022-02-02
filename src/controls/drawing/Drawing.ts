import Control from "sap/ui/core/Control";
import HTML from "sap/ui/core/HTML";
// @ts-ignore
import d3 from "sap/ui/thirdparty/d3";
import {DrawCircle} from "../../tools/DrawCircle";
import {InteractionEventData, InteractionEvents} from "./InteractionEvents";
import {ObjectRenderer, RenderLayer} from "./Objects/ObjectRenderer";
import {SvgObjectRenderer} from "./Objects/SvgObjectRenderer";
import {GrObject} from "../../Geo/GrObject";
import {DrawRectangle} from "../../tools/DrawRectangle";
import {Selection} from "d3";
import {MoveTool} from "../../tools/MoveTool";
import {DrawLine} from "../../tools/DrawLine";
import {RotateTool} from "../../tools/RotateTool";
import {ToolManager} from "./ToolManager";
import {DrawPolygon} from "../../tools/DrawPolygon";
import {DrawQuadratic} from "../../tools/DrawQuadratic";
import {ScaleTool} from "../../tools/ScaleTool";
import {Point2D} from "../../Geo/Point2D";
import {SelectTool} from "../../tools/SelectTool";
import {GrCanvas} from "../../Geo/GrCanvas";
import {DrawLibraryInstance} from "../../tools/DrawLibraryInstance";
import {LibraryEntry} from "../../Library";
import {AppConfig} from "../../AppConfig";


enum ToolNames {
    Select,
    Circle,
    Rectangle,
    Line,
    Polygon,
    Quadric,
    Instance,
    Move,
    Rotate,
    Scale,
    None
}


/**
 *
 * See https://github.com/SAP-samples/ui5-typescript-helloworld/tree/custom-controls
 *
 * @namespace sts.drawable.controls.drawing
 */
export default class Drawing extends Control {

    private _containerId: string;
    private _svg: Selection<any>;
    private _toolManager: ToolManager;
    private _objectRenderer: ObjectRenderer;
    private _bezelSize = AppConfig.SVG.canvasBezelSize;
    private _width = 10;
    private _height = 10;

    static readonly metadata = {
        properties: {},

        events: {
            newOperation: {
                code: "any"
            },

            selectionChange: {
                selection: "any"
            },

            objectDeleted: {
                object: "any"
            },

            nextStep: {},

            previousStep: {}
        },

        aggregations: {
            _svg: {type: "sap.ui.core.HTML", multiple: false, visibility: "hidden"}
        }
    }

    private _lastMouse: Point2D;
    private _objects: Array<GrObject>;

    // The following three lines were generated and should remain as-is to make TypeScript aware of the constructor signatures
    private _otherObjectIndex: number = -1;

    constructor(idOrSettings?: string | $DrawingSettings);
    constructor(id?: string, settings?: $DrawingSettings);
    constructor(id?: string, settings?: $DrawingSettings) {
        super(id, settings);
    }


    public init() {
        super.init();
        this._containerId = this._makeId("container");

        this.setAggregation("_svg", new HTML({
            content: `<svg id="${this._containerId}" viewBox="0, 0, 100,100" tabindex="1000000000"></svg>`
        }));
    }

    public setCanvas(canvas: GrCanvas) {
        const svg = d3.select(this.getDomRef()).select("svg");
        const bb = canvas.boundingBox;
        svg.attr("viewBox", `${bb.x - bb.w / 2 - this._bezelSize}, ${bb.y - bb.h / 2 - this._bezelSize}, ${bb.w + 2 * this._bezelSize}, ${bb.h + 2 * this._bezelSize}`);
        this._width = bb.w;
        this._height = bb.h;
    }

    protected _onToolDone(result) {
        this.fireNewOperation({code: result});
        this._objectRenderer.clear(RenderLayer.Interaction);
    }

    protected _onToolAbort() {
        this._objectRenderer.clear(RenderLayer.Interaction);
    }

    protected _onToolSwitch() {
        this._otherObjectIndex = -1;
    }

    protected _setupTools() {
        this._toolManager = new ToolManager(this._objectRenderer);
        this._toolManager.doneCallBack = this._onToolDone.bind(this);
        this._toolManager.abortCallBack = this._onToolAbort.bind(this);
        this._toolManager.switchCallBack = this._onToolSwitch.bind(this);

        this._toolManager.addTool(DrawCircle, ToolNames.Circle);
        this._toolManager.addTool(DrawLine, ToolNames.Line);
        this._toolManager.addTool(DrawRectangle, ToolNames.Rectangle);
        this._toolManager.addTool(MoveTool, ToolNames.Move);
        this._toolManager.addTool(RotateTool, ToolNames.Rotate);
        this._toolManager.addTool(ScaleTool, ToolNames.Scale);
        this._toolManager.addTool(DrawPolygon, ToolNames.Polygon);
        this._toolManager.addTool(DrawQuadratic, ToolNames.Quadric);
        this._toolManager.addTool(SelectTool, ToolNames.Select);
        this._toolManager.addTool(DrawLibraryInstance, ToolNames.Instance);

        this._toolManager.setToolAfterDone(SelectTool);

        this._toolManager.switch(ToolNames.Move);
    }

    public onAfterRendering(oEvent: jQuery.Event) {
        super.onAfterRendering(oEvent);

        this._svg = d3.select(this.getDomRef()).select("svg")
        this._objectRenderer = new SvgObjectRenderer(this._svg, this._onObjectClick.bind(this));
        this._setupTools();
        this._setupMouseEvents();
    }

    private _makeId(suffix: string): string {
        return `${this.getId()}--${suffix}`;
    }

    private _setupMouseEvents(): void {
        this._svg.on("mousedown", this._interActionMouseDown.bind(this))
        this._svg.on("mouseup", this._interActionMouseUp.bind(this))
        this._svg.on("mouseleave", this._interActionMouseLeave.bind(this))
        this._svg.on("mouseenter", this._interActionMouseEnter.bind(this))
        this._svg.on("mousemove", this._interActionMouseMove.bind(this))
        this._svg.on("click", this._interActionClick.bind(this))
//        this._svg.on("keyup", this._interActionKeyDown.bind(this))
        this._svg.on("contextmenu", this._interActionClick.bind(this))

        document.onkeyup = this._interActionKeyDown.bind(this);
    }

    setObjects(objects: Array<GrObject>): Drawing {
        this._objects = objects;
        return this;
    }

    update(clearAllFirst: boolean = false) {
        if (clearAllFirst) {
            this._objectRenderer.clear(RenderLayer.Objects);
        }
        this._renderAll();
    }

    private _renderAll(): void {
        this._objectRenderer.reset();
        this._objects.forEach(obj => {
            this._objectRenderer.render(obj as GrObject, this._toolManager.isSelected(obj));
        });
    }

    protected _constrainToBezel(ed: InteractionEventData) {
        if (ed.x < 0) {
            ed.dx -= 0 - ed.x;
            ed.x = 0;
        }
        if (ed.x > this._width) {
            ed.dx -= ed.x - this._width;
            ed.x = this._width;
        }

        if (ed.y < 0) {
            ed.dy -= 0 - ed.y;
            ed.y = 0;
        }
        if (ed.y > this._height) {
            ed.dy -= ed.y - this._height;
            ed.y = this._height;
        }
    }

    private _pumpToTool(interactionEvent: InteractionEvents) {
        const d3Ev = d3.event;
        let ed:InteractionEventData;
        if (d3Ev) {

            const d3MEv = d3.mouse(this._svg.node());
            ed = {
                interactionEvent,
                x: d3MEv[0],
                y: d3MEv[1],
                dx: d3Ev.movementX,
                dy: d3Ev.movementY,
                alt: d3Ev.altKey, button: d3Ev.button, buttons: d3Ev.buttons, ctrl: d3Ev.ctrlKey, shift: d3Ev.shiftKey,
                key: d3Ev.key, keyCode: d3Ev.keyCode,
                selection: null
            };

            this._constrainToBezel(ed);

            if (!isNaN(ed.x)) {
                this._lastMouse = new Point2D(ed.x, ed.y)
            } else if (this._lastMouse) {
                ed.x = this._lastMouse.x;
                ed.y = this._lastMouse.y;
            }
        } else {
            ed = {
                alt: false,
                button: 0,
                buttons: false,
                ctrl: false,
                dx: 0,
                dy: 0,
                interactionEvent: undefined,
                key: "",
                keyCode: 0,
                shift: false,
                x: 0,
                y: 0
            }
        }

        if (interactionEvent === InteractionEvents.OtherObject) {
            this._otherObjectIndex++;
            ed.object = this._objects[this._otherObjectIndex];
            while (ed.object && !ed.object.selectable) {
                this._otherObjectIndex++;
                ed.object = this._objects[this._otherObjectIndex];
                if (this._otherObjectIndex >= this._objects.length) {
                    ed.object = null;
                    break;
                }
            }
            if (!ed.object) {
                this._otherObjectIndex = -1;
            }
        }

        if (interactionEvent === InteractionEvents.Cancel) {
            this._toolManager.abortCurrentTool();
        } else {
            this._toolManager.pump(interactionEvent, ed);
        }

    }

    private _interActionMouseDown() {
        this._pumpToTool(InteractionEvents.MouseDown)
    }

    private _interActionMouseUp() {
        this._pumpToTool(InteractionEvents.MouseUp)
    }

    private _interActionMouseMove() {
        this._pumpToTool(InteractionEvents.MouseMove)
    }

    private _interActionMouseLeave() {
        this._pumpToTool(InteractionEvents.MouseLeave)
    }

    private _interActionMouseEnter() {
        if (document.activeElement && document.activeElement.tagName.toUpperCase() === "INPUT") {
            return;
        }

        // (this._svg.node() as HTMLElement).focus();
        this._pumpToTool(InteractionEvents.MouseEnter)
    }

    private _interActionClick() {
        if (d3.event.button != 0) {
            d3.event.preventDefault();
            this._pumpToTool(InteractionEvents.AlternateClick)
        } else {
            this._pumpToTool(InteractionEvents.Click)
        }
    }

    public startToolInsertLibraryEntry(entry: LibraryEntry) {
        this._toolManager.switch(ToolNames.Instance, entry);
    }

    private _interActionKeyDown(event) {
        if (document.activeElement && document.activeElement.tagName.toUpperCase() === "INPUT") {
            return;
        }

        if (event.code === "Tab") {
            event.preventDefault();
        }

        if (event.code === AppConfig.Keys.NextStepCode) {
            this.fireNextStep();
        } else if (event.code === AppConfig.Keys.DeleteCode) {
            this.fireObjectDeleted();
        } else if (event.code === AppConfig.Keys.ObjectSnapCode) {
            event.preventDefault();
            this._pumpToTool(InteractionEvents.OtherObject);
        } else if (event.keyCode === AppConfig.Keys.AbortToolKeyCode) {
            this._pumpToTool(InteractionEvents.Cancel);
            this._toolManager.abortCurrentTool();
        } else if (event.key === AppConfig.Keys.DrawCircleKey) {
            this._toolManager.switch(ToolNames.Circle);
        } else if (event.key === AppConfig.Keys.DrawRectKey) {
            this._toolManager.switch(ToolNames.Rectangle);
        } else if (event.key === AppConfig.Keys.DrawLineKey) {
            this._toolManager.switch(ToolNames.Line);
        } else if (event.key === AppConfig.Keys.DrawPolygonKey) {
            this._toolManager.switch(ToolNames.Polygon);
        } else if (event.key === AppConfig.Keys.DrawQuadricKey) {
            this._toolManager.switch(ToolNames.Quadric);
        } else if (event.key === AppConfig.Keys.MoveKey) {
            this._toolManager.switch(ToolNames.Move);
        } else if (event.key === AppConfig.Keys.RotateKey) {
            this._toolManager.switch(ToolNames.Rotate);
        } else if (event.key === AppConfig.Keys.ScaleKey) {
            this._toolManager.switch(ToolNames.Scale);
        } else {
            this._pumpToTool(InteractionEvents.Key)
        }
    }

    public selectObject(object: GrObject) {
        if (!object.selectable) {
            return;
        }
        if (this._toolManager.isSelected(object)) {
            this._toolManager.deselectObject(object);
        } else {
            this._toolManager.selectObject(object);
        }
    }

    private _onObjectClick(object: GrObject) {

        if (!object.selectable) {
            return;
        }

        if (this._toolManager.isSelected(object)) {
            this._toolManager.deselectObject(object);
            this._objectRenderer.removeBoundingRepresentation(object);
        } else {
            this._toolManager.selection.forEach(obj => {
                this._objectRenderer.removeBoundingRepresentation(obj);
            })
            this._toolManager.selectObject(object);
        }
        this.fireSelectionChange({selection: this._toolManager.selection});
    }

    private _deleteSelection() {
        if (this._toolManager.selection.length === 1) {
            this.fireObjectDeleted({object: this._toolManager.selection[0]})
        }
    }

}
