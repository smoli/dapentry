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
    private _circle;
    private _cx: number;
    private _cy: number;
    private _r: number;

    constructor(interactionLayer) {
        super(interactionLayer, States.DrawCircle_Wait, States.DrawCircle_Done)

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
                this._cx = eventData.x;
                this._cy = eventData.y;

                this._circle = this._interactionLayer.append("circle")
                    .attr("cx", eventData.x)
                    .attr("cy", eventData.y)
                    .attr("r", 0)
                break;

            case States.DrawCircle_DragRadius:
                const r = Math.sqrt((eventData.x - this._cx) ** 2 + (eventData.y - this._cy) ** 2);
                this._circle.attr("r", r)
                break;

            case States.DrawCircle_Done:
                this._r = Math.sqrt((eventData.x - this._cx) ** 2 + (eventData.y - this._cy) ** 2);

        }

        return this.isDone;
    }

    public get result(): any {
        if (!this.isDone) {
            return null;
        } else {
            return new GRCircle(this._cx, this._cy, this._r);
        }
    }

}