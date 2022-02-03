import {Tool} from "../../tools/Tool";
import {ObjectRenderer} from "./Objects/ObjectRenderer";
import {InteractionEventData, InteractionEvents} from "./InteractionEvents";
import {GrObject} from "../../Geo/GrObject";

export type SwitchEvent = (number | string);
export type SwitchCallback = (event:SwitchEvent, tool:Tool) => void;

/**
 * Manages a set of tools and their lifecycle.
 */
export class ToolManager {
    private readonly _tools: { [key: (string | symbol | number)]: typeof Tool }
    private readonly _objectRenderer: ObjectRenderer;
    private readonly _specificToolClassesAfterDone: { [key: string]: SwitchEvent };

    private _currentTool: Tool;
    private _toolEventAfterAbort: SwitchEvent;
    private _toolClassAfterDone: SwitchEvent;
    private _doneCallback: (any) => void;
    private _previewCallback: (any) => void;
    private _abortCallback: () => void;
    private _selection: Array<GrObject>;
    private _switchCallBack:SwitchCallback;


    constructor(objectRenderer: ObjectRenderer) {
        this._objectRenderer = objectRenderer;
        this._tools = {};
        this._specificToolClassesAfterDone = {};
        this._currentTool = null;
        this._selection = [];
    }

    set previewCallBack(doneCallback: (any) => void) {
        this._previewCallback = doneCallback;
    }

    set doneCallBack(doneCallback: (any) => void) {
        this._doneCallback = doneCallback;
    }

    set abortCallBack(doneCallback: () => void) {
        this._abortCallback = doneCallback;
    }

    set switchCallBack(switchCallBack: SwitchCallback) {
        this._switchCallBack = switchCallBack;
    }



    public addTool(ToolClass: typeof Tool, event: (string | number | symbol)) {
        this._tools[event] = ToolClass;
    }

    public setToolEventAfterAbort(event:SwitchEvent) {
        this._toolEventAfterAbort = event;
    }

    public setToolAfterDone(event:SwitchEvent, forCurrentToolClass?: typeof Tool) {
        if (forCurrentToolClass) {
            const name = Object.keys(this._tools).find(k => this._tools[k] === forCurrentToolClass);
            this._specificToolClassesAfterDone[name] = event;
        } else {
            this._toolClassAfterDone = event;
        }
    }

    protected getClassForInstance(toolInstance: Tool): typeof Tool {
        return Object.values(this._tools).find(c => toolInstance instanceof c);
    }

    protected getEventForAfterDone(toolInstance: Tool): SwitchEvent {
        let event;
        const name = Object.keys(this._tools).find(k => toolInstance instanceof this._tools[k]);
        if (name) {
            event = this._specificToolClassesAfterDone[name];
        }

        if (!event) {
            event = this._toolClassAfterDone;
        }
        return event;
    }

    protected getClassForAfterDone(toolInstance: Tool): typeof Tool {

        return this._tools[this.getEventForAfterDone(toolInstance)];
    }

    public get currentTool(): Tool {
        return this._currentTool;
    }

    protected _makeToolInstance(ToolClass: typeof Tool, params: Array<any> = []): Tool {
        // @ts-ignore
        return new ToolClass(this._objectRenderer, ...params);
    }


    protected _abortCurrentTool() {
        this._currentTool.abort();

        if (this._abortCallback) {
            this._abortCallback();
        }
    }

    /**
     * Abort current tool.
     */
    public abortCurrentTool() {
        if (this._currentTool) {
            this._abortCurrentTool();

            if (this._toolEventAfterAbort) {
                this._currentTool = this._makeToolInstance(this._tools[this._toolEventAfterAbort]);
                if (this._switchCallBack) {
                    this._switchCallBack(this._toolEventAfterAbort, this._currentTool);
                }
            } else {
                this._currentTool.reset();
            }
        }
    }

    /**
     * Switch to another tool
     * @param event
     * @param params
     */
    public switch(event: (string | number), ...params: Array<any>) {
        const ToolClass = this._tools[event] || null;

        if (ToolClass) {
            if (this._currentTool) {
                this._abortCurrentTool();
                this._currentTool.tearDown();
            }
            this._currentTool = this._makeToolInstance(ToolClass, params);
            this._pumpSelection(false);
            if (this._switchCallBack) {
                this._switchCallBack(event, this._currentTool);
            }
        }
    }

    /**
     * Pass event information representing the user's interaction to the current tool.
     * Use this instead of calling `update` directly on the currentTool to enable automatic
     * tool switching after done.
     *
     * @see setToolAfterDone
     * @param interactionEvent
     * @param eventData
     */
    public pump(interactionEvent: InteractionEvents, eventData: InteractionEventData) {
        if (this._currentTool) {
            if (eventData) {
                eventData.selection = [...this._selection];
            }
            this._currentTool.update(interactionEvent, eventData);

            if (this._currentTool.isDone) {

                if (this._doneCallback) {
                    this._doneCallback(this._currentTool.result);
                }

                this._currentTool.finish();

                const nextEvent = this.getEventForAfterDone(this._currentTool);
                const ToolClass = this.getClassForAfterDone(this._currentTool);
                if (ToolClass) {
                    this._currentTool.tearDown();
                    this._currentTool = this._makeToolInstance(ToolClass);
                    if (this._switchCallBack) {
                        this._switchCallBack(nextEvent, this._currentTool);
                    }
                } else {
                    this._currentTool.reset();
                }
            } else if (this._previewCallback) {
                this._previewCallback(this._currentTool.resultPreview);
            }
        }
    }

    protected _pumpSelection(pumpEmpty:boolean = true) {
        if (this._currentTool && (this._selection.length || pumpEmpty)) {
            this.pump(InteractionEvents.Selection,
                {
                    selection: [...this._selection],        // If tools store the selection we don't want to mess with their state
                    interactionEvent: InteractionEvents.Selection,
                    x: 0,
                    y: 0,
                    dx: 0,
                    dy: 0,
                    button: 0,
                    buttons: false,
                    ctrl: false,
                    shift: false,
                    alt: false,
                    key: "",
                    keyCode: 0
                });
        }
    }

    public selectObject(object: GrObject) {
        this._selection = [object];
        this._pumpSelection();
    }

    public addObjectToSelection(object: GrObject) {
        if (this._selection.indexOf(object) !== -1) {
            return;
        }
        this._selection.push(object);
        this._pumpSelection();
    }

    public deselectObject(object: GrObject) {
        const i = this._selection.indexOf(object);
        if (i !== -1) {
            this._selection.splice(i, 1);
            this._pumpSelection();
        }
    }

    public isSelected(object:GrObject) {
        return this._selection.indexOf(object) !== -1;
    }

    public deselectAll() {
        this._selection = [];
        this._pumpSelection();
    }

    get selection():Array<GrObject> {
        return this._selection;
    }
}