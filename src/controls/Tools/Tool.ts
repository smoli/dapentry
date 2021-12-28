import {state, StateMachine} from "../../runtime/tools/StateMachine";
import {InteractionEvents, InteractionEventData} from "../InteractionEvents";

export abstract class Tool {

    protected _interactionLayer;
    protected _state: StateMachine;
    protected readonly _doneStateId: string;
    protected readonly _waitStateId: string;

    protected constructor(interactionLayer, waitStateId:string, doneStateId: string) {
        this._interactionLayer = interactionLayer;
        this._waitStateId = waitStateId;
        this._doneStateId = doneStateId;
        this._state = new StateMachine();
    }

    public get isDone(): boolean {
        return this._state.state.id === this._doneStateId;
    }

    public reset() {
        this._state.start(state(this._waitStateId));
    }

    public abstract update(interactionEvent: InteractionEvents, eventData: InteractionEventData): boolean;

    public abstract get result(): any;

}