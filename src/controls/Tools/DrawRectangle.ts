import {state, StateMachine} from "../../runtime/tools/StateMachine";
import {InteractionEvents, InteractionEventData} from "../InteractionEvents";
import {GRRectangle} from "../Objects/GrObject";
import {Tool} from "./Tool";

enum States {
    DrawRect_Wait = "DrawRect.Wait",
    DrawRect_FirstPoint = "DrawRect.FirstPoint",
    DrawRect_Drag = "DrawRect.Drag",
    DrawRect_Done = "DrawRect.Done",
}

export class DrawRectangle extends Tool {

    private _rect;
    private _x1: number;
    private _y1: number;
    private _w: number;
    private _h: number;

    constructor(interactionLayer) {
        super(interactionLayer, States.DrawRect_Wait, States.DrawRect_Done);

        this._state.add(state(States.DrawRect_Wait), InteractionEvents.Click, state(States.DrawRect_FirstPoint));
        this._state.add(state(States.DrawRect_FirstPoint), InteractionEvents.MouseMove, state(States.DrawRect_Drag));
        this._state.add(state(States.DrawRect_Drag), InteractionEvents.MouseMove, state(States.DrawRect_Drag));
        this._state.add(state(States.DrawRect_Drag), InteractionEvents.Click, state(States.DrawRect_Done));
    }

    public reset() {
        super.reset();
        this._rect = null;
    }

    public update(interactionEvent: InteractionEvents, eventData: InteractionEventData = null): boolean {

        if (interactionEvent === InteractionEvents.Cancel) {
            this.reset();
            return false;
        }

        let calcRect;

        this._state.next(interactionEvent);

        switch (this._state.state.id) {
            case States.DrawRect_FirstPoint:
                this._x1 = eventData.x;
                this._y1 = eventData.y;

                this._rect = this._interactionLayer.append("rect")
                    .attr("x", eventData.x)
                    .attr("y", eventData.y)
                    .attr("width", 0)
                    .attr("height", 0)
                break;

            case States.DrawRect_Drag:
                calcRect = this._calculateRect(eventData.x, eventData.y)
                this._rect
                    .attr("x", calcRect.x1)
                    .attr("y", calcRect.y1)
                    .attr("width", calcRect.w)
                    .attr("height", calcRect.h);

                break;

            case States.DrawRect_Done:
                calcRect = this._calculateRect(eventData.x, eventData.y)
                this._x1 = calcRect.x1;
                this._y1 = calcRect.y1;
                this._w = calcRect.w;
                this._h = calcRect.h;
        }

        return this.isDone;
    }

    protected _calculateRect(x2: number, y2: number) {
        console.log(this._x1, this._y1, x2, y2)
        const x1 = Math.min(this._x1, x2);
        const y1 = Math.min(this._y1, y2);
        const w = Math.max(this._x1, x2) - x1;
        const h = Math.max(this._y1, y2) - y1;
        console.log(x1, y1, w, h)
        return {x1, y1, w, h}
    }

    public get result(): any {
        if (!this.isDone) {
            return null;
        } else {
            return new GRRectangle(this._x1 + this._w / 2, this._y1 + this._h / 2, this._w, this._h);
        }
    }

}