import {state} from "../../runtime/tools/StateMachine";
import {InteractionEvents, InteractionEventData} from "../InteractionEvents";
import {GRCircle} from "../Objects/GrObject";
import {Tool} from "./Tool";

enum States {
    DrawCircle_Wait = "DrawCircle.Wait",
    DrawCircle_DragRadius = "DrawCircle.DragRadius",
    DrawCircle_FirstPoint = "DrawCircle.FirstPoint",
    DrawCircle_Done = "DrawCircle.Done",
}


export class DrawCircle extends Tool {
    private _circle:GRCircle;

    constructor(renderer) {
        super(renderer, States.DrawCircle_Wait, States.DrawCircle_Done)

        this._state.add(state(States.DrawCircle_Wait), InteractionEvents.Click, state(States.DrawCircle_FirstPoint));
        this._state.add(state(States.DrawCircle_FirstPoint), InteractionEvents.MouseMove, state(States.DrawCircle_DragRadius));
        this._state.add(state(States.DrawCircle_DragRadius), InteractionEvents.MouseMove, state(States.DrawCircle_DragRadius));
        this._state.add(state(States.DrawCircle_DragRadius), InteractionEvents.Click, state(States.DrawCircle_Done));
    }

    public reset() {
        super.reset();
        this._circle = null;
    }

    public update(interactionEvent: InteractionEvents, eventData: InteractionEventData = null): boolean {
        if (interactionEvent === InteractionEvents.Cancel) {
            this.reset();
            return false;
        }

        this._state.next(interactionEvent);

        switch (this._state.state.id) {
            case States.DrawCircle_FirstPoint:
                this._circle = new GRCircle(eventData.x, eventData.y, 0)
                this._renderer.renderCircle(this._circle);
                break;

            case States.DrawCircle_DragRadius:
                this._circle.r = Math.sqrt((eventData.x - this._circle.x) ** 2 + (eventData.y - this._circle.y) ** 2);
                this._renderer.renderCircle(this._circle);
                break;

            case States.DrawCircle_Done:
                this._circle.r = Math.sqrt((eventData.x - this._circle.x) ** 2 + (eventData.y - this._circle.y) ** 2);
        }

        return this.isDone;
    }

    public get result(): any {
        if (!this.isDone) {
            return null;
        } else {
            return this._circle;
        }
    }

}