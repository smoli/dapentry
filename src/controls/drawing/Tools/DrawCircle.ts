import {state} from "../../../runtime/tools/StateMachine";
import {InteractionEventData, InteractionEvents} from "../InteractionEvents";
import {GRCircle} from "../Objects/GrObject";
import {Tool} from "./Tool";
import {RenderLayer} from "../Objects/ObjectRenderer";

enum States {
    Wait = "DrawCircle.Wait",
    DragRadius = "DrawCircle.DragRadius",
    CenterPoint = "DrawCircle.CenterPoint",
    Done = "DrawCircle.Done",
}


export class DrawCircle extends Tool {
    private _circle:GRCircle;

    constructor(renderer) {
        super(renderer, States.Wait, States.Done)

        this._state.add(state(States.Wait), InteractionEvents.Click, state(States.CenterPoint));
        this._state.add(state(States.CenterPoint), InteractionEvents.MouseMove, state(States.DragRadius));
        this._state.add(state(States.DragRadius), InteractionEvents.MouseMove, state(States.DragRadius));
        this._state.add(state(States.DragRadius), InteractionEvents.Click, state(States.Done));
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
            case States.CenterPoint:
                this._circle = GRCircle.create(null, eventData.x, eventData.y, 0);
                this._renderer.renderCircle(RenderLayer.Interaction, this._circle);
                break;

            case States.DragRadius:
                this._circle.r = Math.sqrt((eventData.x - this._circle.x) ** 2 + (eventData.y - this._circle.y) ** 2);
                this._renderer.renderCircle(RenderLayer.Interaction, this._circle);
                break;

            case States.Done:
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

    public get code():string {
        return `CIRCLE $drawing ${this._circle.name} "${this._circle.name}" $styles.default (${this._circle.x} ${this._circle.y}) ${this._circle.r}`
    }
}