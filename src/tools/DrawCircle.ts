import {state} from "../runtime/tools/StateMachine";
import {InteractionEventData, InteractionEvents} from "../controls/drawing/InteractionEvents";
import {SnapInfo, Tool} from "./Tool";
import {RenderLayer} from "../controls/drawing/Objects/ObjectRenderer";
import {GrCircle} from "../Geo/GrCircle";
import {Point2D} from "../Geo/Point2D";
import {AppConfig} from "../AppConfig";

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
    private _fromTo: boolean;
    private _previewCenter: SnapInfo;

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

            case States.Wait:
                this._previewCenter = snapInfo;
                break;

            case States.CenterPoint:
                this._circle = GrCircle.create(null, eventData.x, eventData.y, 0);
                this._centerSnap = snapInfo;
                this._renderer.renderCircle(RenderLayer.Interaction, this._circle, false);
                break;

            case States.DragRadius:
                if (eventData[AppConfig.Keys.CircleP2PModifierName]) {
                    const np = new Point2D(eventData.x, eventData.y);
                    const cp = new Point2D(this._centerSnap.event.x, this._centerSnap.event.y);
                    const r = np.copy.sub(cp).length;
                    const c = cp.copy.add(np.sub(cp).scale(0.5))
                    this._circle.radius = r;
                    this._circle.x = c.x;
                    this._circle.y = c.y;
                    this._circle.radius = Math.sqrt((eventData.x - this._circle.x) ** 2 + (eventData.y - this._circle.y) ** 2);
                } else {
                    this._circle.x = this._centerSnap.event.x;
                    this._circle.y = this._centerSnap.event.y;
                    this._circle.radius = Math.sqrt((eventData.x - this._circle.x) ** 2 + (eventData.y - this._circle.y) ** 2);
                }

                this._secondSnap = snapInfo;
                this._renderer.renderCircle(RenderLayer.Interaction, this._circle, false);
                break;

            case States.Done:
                if (eventData.alt) {
                    this._fromTo = true;
                } else {
                    this._fromTo = false;
                }
                this._circle.radius = Math.sqrt((eventData.x - this._circle.x) ** 2 + (eventData.y - this._circle.y) ** 2);
                this._renderer.remove(this._circle);
        }

        return this.isDone;
    }


    protected getResultPreview(usedSnapInfos: Array<SnapInfo>): string | Array<string> {
        let opcode = AppConfig.Runtime.Opcodes.Circle.CenterRadius;

        if (this._secondSnap) {
            opcode = AppConfig.Runtime.Opcodes.Circle.CenterPoint;
        }

        return this.makeCreateStatement(opcode,
            "newCircle",
            this._centerSnap || this._previewCenter,
            this._secondSnap || (this._circle && this._circle.radius) || 0);
    }

    getResult(): any {
        let opcode = AppConfig.Runtime.Opcodes.Circle.CenterRadius;

        if (this._secondSnap) {
            opcode = AppConfig.Runtime.Opcodes.Circle.CenterPoint;
        }

        return this.makeCreateStatement(opcode,
            this._circle.uniqueName,
            this._centerSnap,
            this._secondSnap || (this._circle && this._circle.radius) || 0);

        // TODO: CIRCLEPP. Need some kind of modifier for that
    }
}