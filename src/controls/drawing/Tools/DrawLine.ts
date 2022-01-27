import {state} from "../../../runtime/tools/StateMachine";
import {InteractionEventData, InteractionEvents} from "../InteractionEvents";
import {SnapInfo, Tool} from "./Tool";
import {RenderLayer} from "../Objects/ObjectRenderer";
import {GrLine} from "../../../Geo/GrLine";
import {GrObject, POI} from "../../../Geo/GrObject";
import {Point2D} from "../../../Geo/Point2D";

enum States {
    Wait = "DrawLine.Wait",
    Drag = "DrawLine.DragRadius",
    P1 = "DrawLine.CenterPoint",
    Done = "DrawLine.Done",
}


export class DrawLine extends Tool {
    private _line: GrLine
    private _firstSnapInfo: SnapInfo;
    private _secondSnapInfo: SnapInfo;
    private _otherObject: GrObject;

    constructor(renderer) {
        super(renderer);
        this.setWaitDoneStates(States.Wait, States.Done);

        this._state.add(state(States.Wait), InteractionEvents.Click, state(States.P1));
        this._state.add(state(States.P1), InteractionEvents.MouseMove, state(States.Drag));
        this._state.add(state(States.Drag), InteractionEvents.MouseMove, state(States.Drag));
        this._state.add(state(States.Drag), InteractionEvents.Click, state(States.Done));
        this._state.start(state(States.Wait));

        this.enablePOISnapping();
    }

    public reset() {
        super.reset();
        this._line = null;
        this._otherObject = null;
    }

    public update(interactionEvent: InteractionEvents, eventData: InteractionEventData = null): boolean {
        if (interactionEvent === InteractionEvents.Cancel) {
            this.reset();
            return false;
        }

        if (interactionEvent === InteractionEvents.OtherObject) {
            this._otherObject = eventData.object;
            if (!this._otherObject) {
                this.enablePOISnapping();
            }
        }

        let snapInfo;

        if (this._otherObject) {
            snapInfo = this.snapToObject(this._otherObject, eventData);
            if (snapInfo !== null) {
                // We only disable point snapping if the object supports at-access
                this.disablePOISnapping();
            } else {
                snapInfo = this.tryToPOISnap(eventData);
            }
        } else {
            snapInfo = this.tryToPOISnap(eventData);
        }
        eventData = snapInfo.event;

        this._state.next(interactionEvent);

        switch (this._state.state.id) {
            case States.P1:
                this._line = GrLine.create(null, eventData.x, eventData.y, eventData.x, eventData.y);
                this._renderer.renderLine(RenderLayer.Interaction, this._line, false);
                this._firstSnapInfo = snapInfo;
                break;

            case States.Drag:
                this._line.x2 = eventData.x;
                this._line.y2 = eventData.y
                this._renderer.renderLine(RenderLayer.Interaction, this._line, false);
                break;

            case States.Done:
                this._line.x2 = eventData.x;
                this._line.y2 = eventData.y;
                this._renderer.remove(this._line);
                this._secondSnapInfo = snapInfo;
                this.disablePOISnapping();
        }

        return this.isDone;
    }

    public get result(): any {
        let one = this.makePointCodeFromSnapInfo(this._firstSnapInfo);
        let two = this.makePointCodeFromSnapInfo(this._secondSnapInfo);
        return [`LINE ${this._line.uniqueName}, $styles.default, ${one}, ${two}`]

    }
}