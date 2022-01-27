import {state} from "../../../runtime/tools/StateMachine";
import {InteractionEventData, InteractionEvents} from "../InteractionEvents";
import {SnapInfo, Tool} from "./Tool";
import {RenderLayer} from "../Objects/ObjectRenderer";
import {GrCircle} from "../../../Geo/GrCircle";

enum States {
    Wait = "DrawCircle.Wait",
    DragRadius = "DrawCircle.DragRadius",
    CenterPoint = "DrawCircle.CenterPoint",
    Done = "DrawCircle.Done",
}


export class DrawCircle extends Tool {
    private _circle:GrCircle;
    private _centerSnap: SnapInfo;
    private _secondSnap: SnapInfo;

    constructor(renderer) {
        super(renderer);
        this.setWaitDoneStates(States.Wait, States.Done);

        this._state.add(state(States.Wait), InteractionEvents.Click, state(States.CenterPoint));
        this._state.add(state(States.CenterPoint), InteractionEvents.MouseMove, state(States.DragRadius));
        this._state.add(state(States.DragRadius), InteractionEvents.MouseMove, state(States.DragRadius));
        this._state.add(state(States.DragRadius), InteractionEvents.Click, state(States.Done));
        this._state.start(state(States.Wait));
        this.enablePOISnapping();
    }

    public reset() {
        super.reset();
        this._circle = null;
    }

    protected _update(interactionEvent: InteractionEvents, snapInfo: SnapInfo = null): boolean {
        const eventData = snapInfo.event;
        if (interactionEvent === InteractionEvents.Cancel) {
            this.reset();
            return false;
        }

        this._state.next(interactionEvent);

        switch (this._state.state.id) {
            case States.CenterPoint:
                this._circle = GrCircle.create(null, eventData.x, eventData.y, 0);
                this._centerSnap = snapInfo;
                this._renderer.renderCircle(RenderLayer.Interaction, this._circle, false);
                break;

            case States.DragRadius:
                this._circle.radius = Math.sqrt((eventData.x - this._circle.x) ** 2 + (eventData.y - this._circle.y) ** 2);
                this._secondSnap = snapInfo;
                this._renderer.renderCircle(RenderLayer.Interaction, this._circle, false);
                break;

            case States.Done:
                this._circle.radius = Math.sqrt((eventData.x - this._circle.x) ** 2 + (eventData.y - this._circle.y) ** 2);
                this._renderer.remove(this._circle);
        }

        return this.isDone;
    }

    public get result(): any {
        if (!this._secondSnap.object) {
            return `CIRCLE ${this._circle.uniqueName}, $styles.default, ${this.makePointCodeFromSnapInfo(this._centerSnap)}, ${this._circle.radius}`
        } else {
            return `CIRCLE ${this._circle.uniqueName}, $styles.default, ${this.makePointCodeFromSnapInfo(this._centerSnap)}, ${this.makePointCodeFromSnapInfo(this._secondSnap)}`
        }

    }
}