import Control from "sap/ui/core/Control";
import HTML from "sap/ui/core/HTML";
// @ts-ignore
import d3 from "sap/ui/thirdparty/d3";
import {DrawCircle} from "./Tools/DrawCircle";
import {InteractionEventData, InteractionEvents} from "./InteractionEvents";
import {ObjectRenderer, RenderLayer} from "./Objects/ObjectRenderer";
import {SvgObjectRenderer} from "./Objects/SvgObjectRenderer";
import {GrObject} from "./Objects/GrObject";
import {DrawRectangle} from "./Tools/DrawRectangle";
import {Selection} from "d3";
import {MoveTool} from "./Tools/MoveTool";
import {DrawLine} from "./Tools/DrawLine";
import {RotateTool} from "./Tools/RotateTool";
import {ToolManager} from "./ToolManager";
import {DrawPolygon} from "./Tools/DrawPolygon";
import {Point2D} from "./Objects/GeoMath";
import {DrawQuadratic} from "./Tools/DrawQuadratic";


enum ToolNames {
    Circle,
    Rectangle,
    Line,
    Polygon,
    Quadric,
    Move,
    Rotate,
    None
}


/**
 *
 * See https://github.com/SAP-samples/ui5-typescript-helloworld/tree/custom-controls
 *
 * @namespace sts.drawable.controls
 */
export default class Drawing extends Control {

    private _containerId: string;
    private _svg: Selection<any>;
    private _toolManager: ToolManager;
    private _objectRenderer: ObjectRenderer;

    static readonly metadata = {
        properties: {
            objects: {type: "any", defaultValue: []}
        },

        events: {
            newOperation: {
                code: "string"
            },

            selectionChange: {
                selection: "any"
            },

            objectDeleted: {
                object: "any"
            }
        },

        aggregations: {
            _svg: {type: "sap.ui.core.HTML", multiple: false, visibility: "hidden"}
        }
    }

    // The following three lines were generated and should remain as-is to make TypeScript aware of the constructor signatures
    private _lastMouse: Point2D;
    constructor(idOrSettings?: string | $DrawingSettings);
    constructor(id?: string, settings?: $DrawingSettings);
    constructor(id?: string, settings?: $DrawingSettings) {
        super(id, settings);
    }


    public init() {
        super.init();
        this._containerId = this._makeId("container");

        this.setAggregation("_svg", new HTML({
            content: `<svg id="${this._containerId}" style="height: 90vh; width: 100%" tabindex="1000000000"></svg>`
        }));
    }


    protected _onToolDone(result) {
        this.fireNewOperation({code: result});
        this._objectRenderer.clear(RenderLayer.Interaction);
    }

    protected _onToolAbort() {
        this._objectRenderer.clear(RenderLayer.Interaction);
    }

    protected _setupTools() {
        this._toolManager = new ToolManager(this._objectRenderer);
        this._toolManager.doneCallBack = this._onToolDone.bind(this);
        this._toolManager.abortCallBack = this._onToolAbort.bind(this);

        this._toolManager.addTool(DrawCircle, ToolNames.Circle);
        this._toolManager.addTool(DrawLine, ToolNames.Line);
        this._toolManager.addTool(DrawRectangle, ToolNames.Rectangle);
        this._toolManager.addTool(MoveTool, ToolNames.Move);
        this._toolManager.addTool(RotateTool, ToolNames.Rotate);
        this._toolManager.addTool(DrawPolygon, ToolNames.Polygon);
        this._toolManager.addTool(DrawQuadratic, ToolNames.Quadric);

        this._toolManager.switch(ToolNames.Move);
    }

    public onAfterRendering(oEvent: jQuery.Event) {
        super.onAfterRendering(oEvent);
        this._svg = d3.select(this.getDomRef()).select("svg")
        this._objectRenderer = new SvgObjectRenderer(this._svg, this._onObjectClick.bind(this));
        this._renderAll();
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
        this._svg.on("keyup", this._interActionKeyDown.bind(this))
        this._svg.on("contextmenu", this._interActionClick.bind(this))
    }

    update(clearAllFirst: boolean = false) {
        if (clearAllFirst) {
            this._objectRenderer.clear(RenderLayer.Objects);
        }
        this._renderAll();
    }

    private _renderAll(): void {
        this._objectRenderer.reset();
        this.getObjects().forEach(obj => {
            this._objectRenderer.render(obj as GrObject, this._toolManager.isSelected(obj));
        });
    }

    private _pumpToTool(interactionEvent: InteractionEvents) {

        const d3Ev = d3.event;
        const d3MEv = d3.mouse(this._svg.node());
        const ed: InteractionEventData = {
            interactionEvent,
            x: d3MEv[0],
            y: d3MEv[1],
            dx: d3Ev.movementX,
            dy: d3Ev.movementY,
            alt: d3Ev.altKey, button: d3Ev.button, buttons: d3Ev.buttons, ctrl: d3Ev.ctrlKey, shift: d3Ev.shiftKey,
            key: d3Ev.key, keyCode: d3Ev.keyCode,
            selection: null
        };
        if (!isNaN(ed.x)) {
            this._lastMouse = new Point2D(ed.x, ed.y)
        } else if (this._lastMouse) {
            ed.x = this._lastMouse.x;
            ed.y = this._lastMouse.y;
        }

        this._toolManager.pump(interactionEvent, ed);
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
        (this._svg.node() as HTMLElement).focus();
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

    private _interActionKeyDown() {
        /*if (d3.event.keyCode === 27) {
            this._updateState(Events.Cancel);
        } else if (d3.event.key === "c") {
            this._updateState(Events.ToolCircle);
        } else if (d3.event.key === "r") {
            this._updateState(Events.ToolRect);
        } else if (d3.event.key === "s") {
            this._updateState(Events.ToolMove);
        } else if (d3.event.key === "l") {
            this._updateState(Events.ToolLine);
        } else if (d3.event.key === "d") {
            this._updateState(Events.ToolRotate);
        }*/

        if (d3.event.keyCode === 27) {
            this._toolManager.abortCurrentTool();
        } else if (d3.event.key === "c") {
            this._toolManager.switch(ToolNames.Circle);
        } else if (d3.event.key === "r") {
            this._toolManager.switch(ToolNames.Rectangle);
        } else if (d3.event.key === "l") {
            this._toolManager.switch(ToolNames.Line);
        } else if (d3.event.key === "p") {
            this._toolManager.switch(ToolNames.Polygon);
        } else if (d3.event.key === "q") {
            this._toolManager.switch(ToolNames.Quadric);
        } else if (d3.event.key === "g") {
            this._toolManager.switch(ToolNames.Move);
        } else if (d3.event.key === "t") {
            this._toolManager.switch(ToolNames.Rotate);
        } else {
            this._pumpToTool(InteractionEvents.Key)
        }
    }

    public selectObject(object: GrObject) {
        if (this._toolManager.isSelected(object)) {
            this._toolManager.deselectObject(object);
        } else {
            this._toolManager.selectObject(object);
        }
    }

    private _onObjectClick(object: GrObject) {
        if (this._toolManager.isSelected(object)) {
            this._toolManager.deselectObject(object);
        } else {
            this._toolManager.selectObject(object);
        }
        this._renderAll();
        this.fireSelectionChange({selection: this._toolManager.selection});
    }

    private _deleteSelection() {
        if (this._toolManager.selection.length === 1) {
            this.fireObjectDeleted({object: this._toolManager.selection[0]})
        }
    }

}