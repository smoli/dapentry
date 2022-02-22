import {ObjectRenderer, RenderLayer} from "../../core/ObjectRenderer";
import {InteractionEventData, InteractionEventKind, InteractionEvents} from "../../core/InteractionEvents";
import {LibraryEntry} from "../../core/Library";
import {ToolNames} from "../../tools/ToolNames";
import {SwitchEvent, ToolManager} from "../../core/ToolManager";
import {DrawCircle} from "../../tools/DrawCircle";
import {DrawLine} from "../../tools/DrawLine";
import {DrawRectangle} from "../../tools/DrawRectangle";
import {MoveTool} from "../../tools/MoveTool";
import {RotateTool} from "../../tools/RotateTool";
import {ScaleTool} from "../../tools/ScaleTool";
import {DrawPolygon} from "../../tools/DrawPolygon";
import {DrawQuadratic} from "../../tools/DrawQuadratic";
import {SelectTool} from "../../tools/SelectTool";
import {DrawLibraryInstance} from "../../tools/DrawLibraryInstance";
import {AppController} from "../../core/AppController";
import {Point2D} from "../../geometry/Point2D";
import {GrObject} from "../../geometry/GrObject";
import {DrawText} from "../../tools/DrawText";

export class DrawingController {
    private _renderer: ObjectRenderer;
    private _toolManager: ToolManager;
    private _appController: AppController;
    private _width = 1000;
    private _height = 1000;
    private _lastMouse: Point2D;
    private _otherObjectIndex: number = -1;
    private _referenceObject: GrObject;
    private _bezelSize: number;

    constructor(appController: AppController, renderer: ObjectRenderer) {
        this._renderer = renderer;
        this._appController = appController;
        this.setupMouse();
        this._setupTools();
    }

    render(objects: Array<GrObject>) {
        this._renderer.clear(RenderLayer.Objects);
        objects.forEach(object => {
            this._renderer.render(object, this._toolManager.isSelected(object));
        })
    }

    updateSelection(oldSelection: Array<GrObject>, newSelection: Array<GrObject>) {
        oldSelection.forEach(obj => {
            this._toolManager.deselectObject(obj);
            this._renderer.removeBoundingRepresentation(obj);
        });
        newSelection.forEach(obj => {
            this._toolManager.selectObject(obj)
            this._renderer.renderBoundingRepresentation(obj);
        });
    }

    set referenceObject(object: GrObject) {
        this._referenceObject = object;

        this._pumpToTool(InteractionEvents.ReferenceObject, null);
    }

    setView(width: number, height: number, bezelSize: number) {
        debugger;
        this._width = width;
        this._height = height;
        this._bezelSize = bezelSize;
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
        this._appController.switchTool(event as ToolNames)
    }

    protected _setupTools() {
        this._toolManager = new ToolManager(this._renderer);
        this._toolManager.doneCallBack = this._onToolDone.bind(this);
        this._toolManager.abortCallBack = this._onToolAbort.bind(this);
        this._toolManager.switchCallBack = this._onToolSwitch.bind(this);
        this._toolManager.previewCallBack = this._onToolPreview.bind(this);

        this._toolManager.addTool(DrawCircle, ToolNames.Circle);
        this._toolManager.addTool(DrawLine, ToolNames.Line);
        this._toolManager.addTool(DrawText, ToolNames.Text);
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


    _makeEmptyInteractionEvent(kind: InteractionEventKind): InteractionEventData {
        return {
            kind,
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


    _pumpToTool(interactionEvent: InteractionEvents, domEvent: ( MouseEvent | KeyboardEvent )) {
        let ed: InteractionEventData;
        if (domEvent) {
            if (domEvent instanceof KeyboardEvent) {
                ed = {
                    ...this._makeEmptyInteractionEvent(InteractionEventKind.key),
                    interactionEvent,
                    key: domEvent.key, keyCode: domEvent.keyCode,
                }
            } else {
                const [x, y] = this._renderer.pointerCoordsFromEvent(domEvent);
                ed = {
                    ...this._makeEmptyInteractionEvent(InteractionEventKind.pointer),
                    interactionEvent,
                    x,
                    y,
                    dx: domEvent.movementX,
                    dy: domEvent.movementY,
                    alt: domEvent.altKey,
                    button: domEvent.button,
                    buttons: domEvent.buttons,
                    ctrl: domEvent.ctrlKey,
                    shift: domEvent.shiftKey,
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
            ed = this._makeEmptyInteractionEvent(InteractionEventKind.none);
        }

        ed.object = this._referenceObject;

        if (interactionEvent === InteractionEvents.Cancel) {
            this._toolManager.abortCurrentTool();
        } else {
            this._toolManager.pump(interactionEvent, ed);
        }
    }

    protected setupMouse() {
        this._renderer.setupMouseHandlers(
            this.onMouseMove.bind(this),
            this.onClick.bind(this),
            this.onRightClick.bind(this),
            this.onMouseDown.bind(this),
            this.onMouseUp.bind(this)
        );
    }

    protected onMouseDown(event: MouseEvent) {
        this._pumpToTool(InteractionEvents.MouseDown, event)
    }

    protected onMouseUp(event: MouseEvent) {
        this._pumpToTool(InteractionEvents.MouseUp, event)
    }

    protected onMouseMove(event: MouseEvent) {
        this._pumpToTool(InteractionEvents.MouseMove, event)
    }

    protected onClick(event: MouseEvent) {
        console.log("Click")
        this._pumpToTool(InteractionEvents.Click, event)
    }

    protected onRightClick(event: MouseEvent) {
        event.preventDefault();
        this._pumpToTool(InteractionEvents.AlternateClick, event)
    }

    public passKeyPressToTool(event: KeyboardEvent) {
        this._pumpToTool(InteractionEvents.Key, event);
    }

    public switchTool(newTool: ToolNames, ...params: Array<any>) {
        if (newTool === null) {
            this._pumpToTool(InteractionEvents.Cancel, null);
            this._toolManager.abortCurrentTool();
        } else {
            this._toolManager.switch(newTool, ...params);
        }
    }
}