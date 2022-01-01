import {state, StateMachine} from "../../../runtime/tools/StateMachine";
import {InteractionEvents, InteractionEventData} from "../InteractionEvents";
import {ObjectRenderer} from "../Objects/ObjectRenderer";

/**
 * Abstract class for tools that create or manipulate objects on the drawing
 */
export abstract class Tool {

    /**
     * Renderer where the intermediate representation of the toll can be drawn.
     * @protected
     */
    protected _renderer:ObjectRenderer;

    /**
     * Handling the tool state
     * @protected
     */
    protected _state: StateMachine;

    /**
     * ID of the state that indicates the tool is done
     * @protected
     */
    protected readonly _doneStateId: string;

    /**
     * ID of the state that indicates that the tool waits for the user to perform the first actions
     * @protected
     */
    protected readonly _waitStateId: string;

    protected constructor(renderer:ObjectRenderer, waitStateId?:string, doneStateId?: string) {
        this._renderer = renderer;
        this._waitStateId = waitStateId;
        this._doneStateId = doneStateId;
        this._state = new StateMachine();
    }

    /**
     * Is the tool done?
     */
    public get isDone(): boolean {
        return this._state.state.id === this._doneStateId;
    }

    /**
     * Use this to tear down anything you need before the tool is deactivated
     */
    public finish():void {
        return;
    }

    /**
     * Abort tool. This does not deactivate the tool.
     */
    public abort():void {
        return;
    }

    /**
     * Reset the tool back to the waiting state.
     */
    public reset() {
        this._state.start(state(this._waitStateId));
    }

    /**
     * This tool instance will not be used again. Clean up.
     */
    public tearDown() {
        return;
    }

    /**
     * This will be called whenever the user interacts with the tool/drawing. Update the tools
     * state here and perform the necessary actions.
     *
     * @param interactionEvent
     * @param eventData
     */
    public abstract update(interactionEvent: InteractionEvents, eventData: InteractionEventData): boolean;

    /**
     * If the tool creates something, return it here.
     */
    public abstract get result(): any;
}