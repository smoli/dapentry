import {state} from "../runtime/tools/StateMachine";
import {InteractionEvents} from "../core/InteractionEvents";
import {SnapInfo, Tool} from "./Tool";
import {RenderLayer} from "../core/ObjectRenderer";
import {GrLine} from "../geometry/GrLine";
import {AppConfig} from "../core/AppConfig";

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
    private _waitSnapInfo: SnapInfo;

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
    }

    protected _update(interactionEvent: InteractionEvents, snapInfo: SnapInfo = null): boolean {

        const eventData = snapInfo.event;

        this._state.next(interactionEvent);

        switch (this._state.state.id) {
            case States.Wait:
                this._waitSnapInfo = snapInfo;
                break;

            case States.P1:
                this._line = GrLine.create(null, eventData.x, eventData.y, eventData.x, eventData.y);
                this._renderer.renderLine(RenderLayer.Interaction, this._line, false);
                this._firstSnapInfo = snapInfo;
                this.snapInfoUsed(snapInfo);
                break;

            case States.Drag:
                this._line.x2 = eventData.x;
                this._line.y2 = eventData.y;
                this._secondSnapInfo = snapInfo;
                this._renderer.renderLine(RenderLayer.Interaction, this._line, false);
                break;

            case States.Done:
                this._line.x2 = eventData.x;
                this._line.y2 = eventData.y;
                this._renderer.remove(this._line);
                this.snapInfoUsed(snapInfo);
                this.disablePOISnapping();
        }

        return this.isDone;
    }

    getResult(snapInfos:Array<SnapInfo>): any {
        let a = snapInfos && snapInfos[0];
        let b = snapInfos && snapInfos[1];

        return this.makeCreateStatement(
            AppConfig.Runtime.Opcodes.Line.PointPoint,
            (this._line && this._line.uniqueName) || "line",
            a || this._waitSnapInfo,
            b || this._secondSnapInfo || a
        )

    }
}