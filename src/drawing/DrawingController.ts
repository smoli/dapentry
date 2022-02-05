import {ObjectRenderer, RenderLayer} from "./ObjectRenderer";
import {Store} from "vuex";
import {AppStore} from "../state/AppStore";
import {InteractionEventData, InteractionEvents} from "./InteractionEvents";
import {LibraryEntry} from "../Library";
import {ToolNames} from "../tools/ToolNames";
import {SwitchEvent, ToolManager} from "./ToolManager";
import {DrawCircle} from "../tools/DrawCircle";
import {DrawLine} from "../tools/DrawLine";
import {DrawRectangle} from "../tools/DrawRectangle";
import {MoveTool} from "../tools/MoveTool";
import {RotateTool} from "../tools/RotateTool";
import {ScaleTool} from "../tools/ScaleTool";
import {DrawPolygon} from "../tools/DrawPolygon";
import {DrawQuadratic} from "../tools/DrawQuadratic";
import {SelectTool} from "../tools/SelectTool";
import {DrawLibraryInstance} from "../tools/DrawLibraryInstance";
import {AppController} from "../AppController";
import {Point2D} from "../geometry/Point2D";
import {GrObject} from "../geometry/GrObject";


export class DrawingController {
    private _renderer: ObjectRenderer;
    private _toolManager: ToolManager;
    private _appController: AppController;
    private _width = 1000;
    private _height = 1000;
    private _lastMouse: Point2D;
    private _objects: Array<GrObject>;
    private _otherObjectIndex: number = -1;

    constructor(appControler: AppController, renderer: ObjectRenderer) {
        this._renderer = renderer;
        this._appController = appControler;
        this._setupTools();
    }

    render(objects: Array<GrObject>) {
        this._renderer.clear(RenderLayer.Objects);
        objects.forEach(object => {
            this._renderer.render(object, false);
        })
    }


    protected _onToolPreview(resultPreview) {
        // TODO: Pass Preview to the UI
    }

    protected async _onToolDone(result) {
        await this._appController.addStatement(result);
        this._renderer.clear(RenderLayer.Interaction);
    }

    protected _onToolAbort() {
        this._renderer.clear(RenderLayer.Interaction);
        // TODO: Tell the app controller that tool was aborted
    }

    protected _onToolSwitch(event: SwitchEvent) {
        // TODO: Tell the rest of the ui that the tool was switched
        //       Without coming back to here because we're receiving that switch
        this._otherObjectIndex = -1;
    }

    protected _setupTools() {
        this._toolManager = new ToolManager(this._renderer);
        this._toolManager.doneCallBack = this._onToolDone.bind(this);
        this._toolManager.abortCallBack = this._onToolAbort.bind(this);
        this._toolManager.switchCallBack = this._onToolSwitch.bind(this);
        this._toolManager.previewCallBack = this._onToolPreview.bind(this);

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

        this._toolManager.setToolAfterDone(ToolNames.Select);
        this._toolManager.setToolEventAfterAbort(ToolNames.Select);

        this._toolManager.switch(ToolNames.Select);
    }


    _makeEmptyInteractionEvent():InteractionEventData {
        return {
            alt: false,
            button: 0,
            buttons: 0,
            ctrl: false,
            dx: 0,
            dy: 0,
            interactionEvent: undefined,
            key: "",
            keyCode: 0,
            object: undefined,
            selection: undefined,
            shift: false,
            x: 0,
            y: 0
        }
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


    _pumpToTool(interactionEvent: InteractionEvents, domEvent:(MouseEvent | KeyboardEvent)) {
        let ed:InteractionEventData;
        if (domEvent) {
            if (domEvent instanceof KeyboardEvent) {
                ed = {
                    ...this._makeEmptyInteractionEvent(),
                    interactionEvent,
                    key: domEvent.key, keyCode: domEvent.keyCode,
                }
            } else {
                const [x, y] = this._renderer.pointerCoordsFromEvent(domEvent);
                ed = {
                    ...this._makeEmptyInteractionEvent(),
                    interactionEvent,
                    x,
                    y,
                    dx: domEvent.movementX,
                    dy: domEvent.movementY,
                    alt: domEvent.altKey, button: domEvent.button, buttons: domEvent.buttons, ctrl: domEvent.ctrlKey, shift: domEvent.shiftKey,
                }
            }

            this._constrainToBezel(ed);

            if (!isNaN(ed.x)) {
                this._lastMouse = new Point2D(ed.x, ed.y)
            } else if (this._lastMouse) {
                ed.x = this._lastMouse.x;
                ed.y = this._lastMouse.y;
            }
        } else {
            ed = this._makeEmptyInteractionEvent();
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

    public onMouseDown(event:MouseEvent) {
        this._pumpToTool(InteractionEvents.MouseDown, event)
    }

    public onMouseUp(event:MouseEvent) {
        this._pumpToTool(InteractionEvents.MouseUp, event)
    }

    public onMouseMove(event:MouseEvent) {
        this._pumpToTool(InteractionEvents.MouseMove, event)
    }

    /*    public onMouseLeave() {
            this._pumpToTool(InteractionEvents.MouseLeave, event)
        }

        public onMouseEnter() {
            if (document.activeElement && document.activeElement.tagName.toUpperCase() === "INPUT") {
                return;
            }

            // (this._svg.node() as HTMLElement).focus();
            this._pumpToTool(InteractionEvents.MouseEnter, event)
        }*/

    public onClick(event: MouseEvent) {
        this._pumpToTool(InteractionEvents.Click, event)
    }

    public onRightClick(event: MouseEvent) {
        event.preventDefault();
        this._pumpToTool(InteractionEvents.AlternateClick, event)
    }

    public startToolInsertLibraryEntry(entry: LibraryEntry) {
        this._toolManager.switch(ToolNames.Instance, entry);
    }

    public switchTool(newTool:ToolNames) {
        if (newTool === null) {
            this._pumpToTool(InteractionEvents.Cancel, null);
            this._toolManager.abortCurrentTool();
        } else {
            this._toolManager.switch(newTool);
        }
    }
}