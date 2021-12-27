import Control from "sap/ui/core/Control";
import HTML from "sap/ui/core/HTML";
// @ts-ignore
import d3 from "sap/ui/thirdparty/d3";
import {state, StateMachine} from "../runtime/tools/StateMachine";
import {DrawCircle} from "./Tools/DrawCircle";
import {InteractionEventData, InteractionEvents} from "./InteractionEvents";
import {ObjectRenderer} from "./Objects/ObjectRenderer";
import {SvgObjectRenderer} from "./Objects/SvgObjectRenderer";
import {GRCircle, GrObject} from "./Objects/GrObject";


enum States {
    Drawing_NoTool = "Drawing.NoTool",
    Drawing_Tool = "Drawing.Tool"
}

/**
 *
 * See https://github.com/SAP-samples/ui5-typescript-helloworld/tree/custom-controls
 *
 * @namespace sts.drawable.controls
 */
export default class Drawing extends Control {

    private _containerId: string;
    private _svg: any;
    private _renderLayer: any;
    private _helperLayer: any;
    private _interactionLayer: any;
    private _interactionState: StateMachine;
    private _objectRenderer:ObjectRenderer;

    static readonly metadata = {
        properties: {
            objects: {type: "any", defaultValue: []}
        },

        events: {
            newObject: {
                object: "any"
            }
        },

        aggregations: {
            _svg: {type: "sap.ui.core.HTML", multiple: false, visibility: "hidden"}
        }
    }

    // The following three lines were generated and should remain as-is to make TypeScript aware of the constructor signatures
    constructor(idOrSettings?: string | $DrawingSettings);
    constructor(id?: string, settings?: $DrawingSettings);
    constructor(id?: string, settings?: $DrawingSettings) {
        super(id, settings);
    }


    public init() {
        super.init();
        this._containerId = this._makeId("container");

        this.setAggregation("_svg", new HTML({
            content: `<svg id="${this._containerId}" style="height: 90vh; width: 100%"></svg>`
        }));
    }

    private _initializeInteractionState() {
        this._interactionState = new StateMachine();
        this._interactionState.add(state(States.Drawing_NoTool), "ToolSelectCircle", state(States.Drawing_Tool));

        const tool = new DrawCircle(this._interactionLayer);
        tool.reset();
        this._interactionState.start(state(States.Drawing_Tool, tool))
    }

    public onAfterRendering(oEvent: jQuery.Event) {
        super.onAfterRendering(oEvent);
        this._svg = d3.select(this.getDomRef()).select("svg")
        this._setupLayers();
        this._objectRenderer = new SvgObjectRenderer(this._renderLayer);
        this._renderAll();
        this._initializeInteractionState();
    }

    private _makeId(suffix: string): string {
        return `${this.getId()}--${suffix}`;
    }

    private _setupLayers(): void {
        // Interactive drawingLayer
        this._interactionLayer = this._svg.append("g").attr("id", this._makeId("interaction"));

        // Helper/Snapping/Controlpoint layer
        this._helperLayer = this._svg.append("g").attr("id", this._makeId("helper"));

        // RenderLayer
        this._renderLayer = this._svg.append("g").attr("id", this._makeId("render"));

        this._svg.on("mousedown", this._interActionMouseDown.bind(this))
        this._svg.on("mouseup", this._interActionMouseUp.bind(this))
        this._svg.on("mouseleave", this._interActionMouseLeave.bind(this))
        this._svg.on("mouseenter", this._interActionMouseEnter.bind(this))
        this._svg.on("mousemove", this._interActionMouseMove.bind(this))
        this._svg.on("click", this._interActionClick.bind(this))
    }

    update() {
        this._renderAll();
    }

    private _renderAll(): void {
        this.getObjects().forEach(obj => {
            this._objectRenderer.render(obj as GRCircle);
        });
    }

    private _pumpToTool(interactionEvent: InteractionEvents) {

        if (this._interactionState.state.id !== States.Drawing_Tool) {
            return;
        }

        const d3Ev = d3.event;
        const d3MEv = d3.mouse(this._svg.node());
        const ed: InteractionEventData = {
            x: d3MEv[0],
            y: d3MEv[1],
            dx: d3Ev.movementX,
            dy: d3Ev.movementY,
            alt: d3Ev.altKey, button: d3Ev.button, buttons: d3Ev.buttons, ctrl: d3Ev.ctrlKey, shift: d3Ev.shiftKey,
        };

        const tool = (this._interactionState.state.data as DrawCircle);

        const done = tool.update(interactionEvent, ed);
        if (done) {
            const result = tool.result;
            this._interactionLayer.select("*").remove();
            tool.reset();

            this.fireNewObject({ object: result })
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
        this._pumpToTool(InteractionEvents.MouseEnter)
    }

    private _interActionClick() {
        this._pumpToTool(InteractionEvents.Click)
    }

}