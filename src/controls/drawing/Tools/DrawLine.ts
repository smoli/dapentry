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
        super(renderer, States.Wait, States.Done)

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
            this.disablePOISnapping();
            snapInfo = this.snapToObject(this._otherObject, eventData);
        } else {
            snapInfo = this.tryToPOISnap(eventData);
        }
        eventData = snapInfo.event;

        this._state.next(interactionEvent);

        switch (this._state.state.id) {
            case States.P1:
                this._line = GrLine.create(null, eventData.x, eventData.y, eventData.x, eventData.y);
                this._renderer.renderLine(RenderLayer.Interaction, this._line);
                this._firstSnapInfo = snapInfo;
                break;

            case States.Drag:
                this._line.x2 = eventData.x;
                this._line.y2 = eventData.y
                this._renderer.renderLine(RenderLayer.Interaction, this._line);
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
        const x1 = this._line.x1;
        const y1 = this._line.y1;
        const x2 = this._line.x2;
        const y2 = this._line.y2;

        let one = `(${x1}, ${y1})`;
        let two = `(${x2}, ${y2})`;
        if (this._firstSnapInfo.object) {
            if (this._firstSnapInfo.poiId === undefined) {
                const pct = this._firstSnapInfo.object.projectPointAsPercentage(this._firstSnapInfo.point);
                one = `${this._firstSnapInfo.object.name}@${pct}`
            } else {
                one = `${this._firstSnapInfo.object.name}@${POI[this._firstSnapInfo.poiId]}`
            }
        }
        if (this._secondSnapInfo.object) {
            if (this._secondSnapInfo.poiId === undefined) {
                const pct = this._secondSnapInfo.object.projectPointAsPercentage(this._secondSnapInfo.point);
                two = `${this._secondSnapInfo.object.name}@${pct}`
            } else {
                two = `${this._secondSnapInfo.object.name}@${POI[this._secondSnapInfo.poiId]}`
            }
        }


        return [`LINE ${this._line.uniqueName}, $styles.default, ${one}, ${two}`]

    }
}