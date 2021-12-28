import Control from "sap/ui/core/Control";
import HTML from "sap/ui/core/HTML";
// @ts-ignore
import d3 from "sap/ui/thirdparty/d3";
import {state, StateMachine} from "../runtime/tools/StateMachine";
import {DrawCircle} from "./Tools/DrawCircle";
import {InteractionEventData, InteractionEvents} from "./InteractionEvents";
import {ObjectRenderer} from "./Objects/ObjectRenderer";
import {SvgObjectRenderer} from "./Objects/SvgObjectRenderer";
import {GrObject} from "./Objects/GrObject";
import {DrawRectangle} from "./Tools/DrawRectangle";


enum States {
    Drawing_NoTool = "Drawing.NoTool",
    Drawing_Tool = "Drawing.Tool"
}

enum Events {
    ToolCircle,
    ToolRect,
    Cancel
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
    private _interactionRenderer:ObjectRenderer;

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
            content: `<svg id="${this._containerId}" style="height: 90vh; width: 100%" tabindex="1000000000"></svg>`
        }));
    }

    private _initializeInteractionState() {
        this._interactionState = new StateMachine();
        this._interactionState.add(state(States.Drawing_NoTool), Events.ToolCircle, state(States.Drawing_Tool));
        this._interactionState.add(state(States.Drawing_NoTool), Events.ToolRect, state(States.Drawing_Tool));
        this._interactionState.add(state(States.Drawing_Tool), Events.Cancel, state(States.Drawing_NoTool));
        this._interactionState.start(state(States.Drawing_NoTool));
    }

    public onAfterRendering(oEvent: jQuery.Event) {
        super.onAfterRendering(oEvent);
        this._svg = d3.select(this.getDomRef()).select("svg")
        this._setupLayers();
        this._objectRenderer = new SvgObjectRenderer(this._renderLayer);
        this._interactionRenderer = new SvgObjectRenderer(this._interactionLayer)
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
        this._svg.on("keyup", this._interActionKeyDown.bind(this))
    }

    update() {
        this._renderAll();
    }

    private _renderAll(): void {
        this.getObjects().forEach(obj => {
            this._objectRenderer.render(obj as GrObject);
        });
    }


    private _updateState(event:Events) {
        this._interactionState.next(event);

        switch(this._interactionState.state.id) {
            case States.Drawing_Tool:
                let tool;
                switch (event) {
                    case Events.ToolCircle:
                        tool = new DrawCircle(this._interactionRenderer);
                        break;
                    case Events.ToolRect:
                        tool = new DrawRectangle(this._interactionRenderer);
                        break;
                    case Events.Cancel:
                        break;
                }
                tool.reset();
                this._interactionState.state.data = tool;
                break;

            case States.Drawing_NoTool:
                this._interactionState.state.data = null;
        }

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
            key: d3Ev.key, keyCode: d3Ev.keyCode
        };

        const tool = (this._interactionState.state.data as DrawCircle);

        const done = tool.update(interactionEvent, ed);
        if (done) {
            const result = tool.result;
            this._interactionRenderer.clear();
            tool.reset();
            this.fireNewObject({ object: result })
        } else if (interactionEvent == InteractionEvents.Cancel) {
            this._interactionRenderer.clear();
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
        if (d3.event.button != 0) {
            this._pumpToTool(InteractionEvents.AlternateClick)
        } else {
            this._pumpToTool(InteractionEvents.Click)
        }
    }

    private _interActionKeyDown() {
        if (d3.event.keyCode === 27) {
            this._pumpToTool(InteractionEvents.Cancel);
        } else if (d3.event.key == "c") {
            this._pumpToTool(InteractionEvents.Cancel);
            this._updateState(Events.ToolCircle);
        } else if (d3.event.key == "r") {
            this._pumpToTool(InteractionEvents.Cancel);
            this._updateState(Events.ToolRect);
        }
    }

}