import Control from "sap/ui/core/Control";
import HTML from "sap/ui/core/HTML";
// @ts-ignore
import d3 from "sap/ui/thirdparty/d3";
import {state, StateMachine} from "../../runtime/tools/StateMachine";
import {DrawCircle} from "./Tools/DrawCircle";
import {InteractionEventData, InteractionEvents} from "./InteractionEvents";
import {ObjectRenderer, RenderLayer} from "./Objects/ObjectRenderer";
import {SvgObjectRenderer} from "./Objects/SvgObjectRenderer";
import {GrObject} from "./Objects/GrObject";
import {DrawRectangle} from "./Tools/DrawRectangle";
import {Selection} from "d3";
import {MoveTool} from "./Tools/MoveTool";
import {Tool} from "./Tools/Tool";


/**
 * States of the drawing
 */
enum States {
    NoTool = "Drawing.NoTool",
    DrawingTool = "Drawing.DrawingTool",
    ManipulationTool = "Drawing.ManipulationTool"
}

enum ToolNames {
    Circle,
    Rectangle,
    Move,
    None
}

/**
 * Events that trigger state transitions
 */
enum Events {
    /**
     * GfxCircle tool was selected
     */
    ToolCircle,

    /**
     * Rectangle tool was selected
     */
    ToolRect,

    /**
     * Move tool was selected
     */
    ToolMove,

    /**
     * Tool was cancelled
     */
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
    private _svg: Selection<any>;

    private _interactionState: StateMachine;
    private _objectRenderer:ObjectRenderer;
    private _selection:Array<GrObject>;
    private _currentTool:Tool;

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

        this._selection = [];
    }

    private _initializeInteractionState() {
        this._interactionState = new StateMachine();
        this._interactionState.add(state(States.NoTool), Events.ToolCircle, state(States.DrawingTool));
        this._interactionState.add(state(States.NoTool), Events.ToolMove, state(States.ManipulationTool));

        this._interactionState.add(state(States.NoTool), Events.ToolRect, state(States.DrawingTool));
        this._interactionState.add(state(States.ManipulationTool), Events.ToolCircle, state(States.DrawingTool));
        this._interactionState.add(state(States.ManipulationTool), Events.ToolRect, state(States.DrawingTool));
        this._interactionState.add(state(States.ManipulationTool), Events.ToolMove, state(States.ManipulationTool));

        this._interactionState.add(state(States.DrawingTool), Events.Cancel, state(States.NoTool));
        this._interactionState.add(state(States.ManipulationTool), Events.Cancel, state(States.NoTool));

        this._interactionState.add(state(States.NoTool), Events.ToolMove, state(States.ManipulationTool));
        this._interactionState.add(state(States.DrawingTool), Events.ToolMove, state(States.ManipulationTool));

        this._interactionState.start(state(States.NoTool));
    }

    public onAfterRendering(oEvent: jQuery.Event) {
        super.onAfterRendering(oEvent);
        this._svg = d3.select(this.getDomRef()).select("svg")
        this._objectRenderer = new SvgObjectRenderer(this._svg, this._onObjectClick.bind(this));
        this._renderAll();
        this._setupMouseEvents();
        this._initializeInteractionState();
        this._updateState(Events.ToolMove);

        const b = this.getBinding("objects");

        b.attachChange(() => {
            debugger;
        })
        b.attachRefresh(() => {
            debugger;
        })
        b.attachDataReceived(() => {
            debugger;
        })
        b.attachAggregatedDataStateChange(() => {
            debugger;
        })
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
    }

    update(clearAllFirst:boolean = false) {
        if (clearAllFirst) {
            this._objectRenderer.clear(RenderLayer.Objects);
        }
        this._renderAll();
    }

    private _renderAll(): void {
        this.getObjects().forEach(obj => {
            this._objectRenderer.render(obj as GrObject, this._selection.indexOf(obj) !== -1);
        });
    }



    private _cancelTool():void {
        if (this._currentTool) {
            this._currentTool.finish();
            this._currentTool.cancel();
            this._objectRenderer.clear(RenderLayer.Interaction);
        }
    }

    private _switchTool(newTool:ToolNames):void {
        this._cancelTool();

        let tool = null;
        switch (newTool) {
            case ToolNames.Circle:
                tool = new DrawCircle(this._objectRenderer);
                break;
            case ToolNames.Rectangle:
                tool = new DrawRectangle(this._objectRenderer);
                break;

            case ToolNames.Move:
                tool = new MoveTool(this._objectRenderer);
                break;

            case ToolNames.None:
                break;
        }

        if (tool) {
            tool.reset();
            tool.selection = this._selection;
            tool.initialize();
            this._currentTool = tool;
        }
    }


    private _updateState(event:Events) {
        console.log("State transition requested", Events[event], event);
        this._interactionState.next(event);

        switch(this._interactionState.state.id) {

            case States.NoTool:
                this._cancelTool();
                this._interactionState.state.data = null;
                break;

            case States.DrawingTool:
                switch (event) {
                    case Events.ToolCircle:
                        this._switchTool(ToolNames.Circle);
                        break;
                    case Events.ToolRect:
                        this._switchTool(ToolNames.Rectangle);
                        break;
                }

                break;

            case States.ManipulationTool:
                switch (event) {
                    case Events.ToolMove:
                        this._switchTool(ToolNames.Move)
                        break;
                }
                break;
        }
    }

    private _pumpToTool(interactionEvent: InteractionEvents) {
        console.log("Pumping", InteractionEvents[interactionEvent], interactionEvent)
        if (this._interactionState.state.id !== States.DrawingTool && this._interactionState.state.id !== States.ManipulationTool) {
            return;
        }

        const d3Ev = d3.event;
        const d3MEv = d3.mouse(this._svg.node());
        const ed: InteractionEventData = {
            interactionEvent,
            x: d3MEv[0],
            y: d3MEv[1],
            dx: d3Ev.movementX,
            dy: d3Ev.movementY,
            alt: d3Ev.altKey, button: d3Ev.button, buttons: d3Ev.buttons, ctrl: d3Ev.ctrlKey, shift: d3Ev.shiftKey,
            key: d3Ev.key, keyCode: d3Ev.keyCode
        };
        console.log("\t", ed);

        const tool = this._currentTool;

        const done = tool.update(interactionEvent, ed);
        if (done) {
            const code = tool.code;
            if(!code) {
                return;
            }
            this._objectRenderer.clear(RenderLayer.Interaction);
            tool.reset();
            this._selection = [];
            this.fireNewOperation({ code })
        } else if (interactionEvent == InteractionEvents.Cancel) {
            this._objectRenderer.clear(RenderLayer.Interaction);
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
        (this._svg.node() as HTMLElement).focus();
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
        if (d3.event.code === "Delete") {
            if (this._interactionState.state.id !== States.DrawingTool) {
                this._deleteSelection();
            }
        } else if (d3.event.keyCode === 27) {
            this._updateState(Events.Cancel);
        } else if (d3.event.key === "c") {
            this._updateState(Events.ToolCircle);
        } else if (d3.event.key === "r") {
            this._updateState(Events.ToolRect);
        } else if (d3.event.key === "s") {
            this._updateState(Events.ToolMove);
        }
    }

    private _onObjectClick(object:GrObject) {
        if (this._interactionState.state.id !== States.ManipulationTool) {
            return;
        }

        const i = this._selection.indexOf(object)
        if (i === -1) {
            //Single select
            this._selection = [object];
            // this._selection.push(object);
        } else {
            this._selection.splice(i, 1);
        }

        this._renderAll();
        if (this._currentTool) {
            this._currentTool.selection = this._selection;
        }

        this.fireSelectionChange({ selection: this._selection });
    }

    private _deleteSelection() {
        if (this._selection.length === 1) {
            this.fireObjectDeleted({ object: this._selection[0] })
        }
    }

}