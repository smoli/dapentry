import {state} from "../../../runtime/tools/StateMachine";
import {InteractionEventData, InteractionEvents} from "../InteractionEvents";
import {GrCircle, GrLine} from "../Objects/GrObject";
import {Tool} from "./Tool";
import {RenderLayer} from "../Objects/ObjectRenderer";

enum States {
    Wait = "DrawLine.Wait",
    Drag = "DrawLine.DragRadius",
    P1 = "DrawLine.CenterPoint",
    Done = "DrawLine.Done",
}


export class DrawLine extends Tool {
    private _line:GrLine

    constructor(renderer) {
        super(renderer, States.Wait, States.Done)

        this._state.add(state(States.Wait), InteractionEvents.Click, state(States.P1));
        this._state.add(state(States.P1), InteractionEvents.MouseMove, state(States.Drag));
        this._state.add(state(States.Drag), InteractionEvents.MouseMove, state(States.Drag));
        this._state.add(state(States.Drag), InteractionEvents.Click, state(States.Done));
    }

    public reset() {
        super.reset();
        this._line = null;
    }

    public update(interactionEvent: InteractionEvents, eventData: InteractionEventData = null): boolean {
        if (interactionEvent === InteractionEvents.Cancel) {
            this.reset();
            return false;
        }

        this._state.next(interactionEvent);

        console.log(eventData.x, eventData.y);
        switch (this._state.state.id) {
            case States.P1:
                this._line = GrLine.create(null, eventData.x, eventData.y, eventData.x, eventData.y);
                this._renderer.renderLine(RenderLayer.Interaction, this._line);
                break;

            case States.Drag:
                this._line.x2 = eventData.x;
                this._line.y2 = eventData.y
                this._renderer.renderLine(RenderLayer.Interaction, this._line);
                break;

            case States.Done:
                this._line.x2 = eventData.x;
                this._line.y2 = eventData.y
        }

        return this.isDone;
    }

    public get result(): any {
        if (!this.isDone) {
            return null;
        } else {
            return this._line;
        }
    }

    public get code():string {
        const x1 = this._line.x + this._line.x1;
        const y1 = this._line.y + this._line.y1;
        const x2 = this._line.x + this._line.x2;
        const y2 = this._line.y + this._line.y2;

        return `LINE $drawing ${this._line.name} "${this._line.name}" $styles.default (${x1} ${y1}) (${x2} ${y2})`

    }
}