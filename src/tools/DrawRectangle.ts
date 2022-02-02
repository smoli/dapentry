import {state} from "../runtime/tools/StateMachine";
import {InteractionEventData, InteractionEvents} from "../controls/drawing/InteractionEvents";
import {SnapInfo, Tool} from "./Tool";
import {RenderLayer} from "../controls/drawing/Objects/ObjectRenderer";
import {GrRectangle} from "../Geo/GrRectangle";
import {AppConfig} from "../AppConfig";
import {Point2D} from "../Geo/Point2D";
import {UNREACHABLE} from "../Assertions";

enum States {
    Wait = "DrawRect.Wait",
    FirstPoint = "DrawRect.FirstPoint",
    DragSize = "DrawRect.DragSize",
    Done = "DrawRect.Done",
}

export class DrawRectangle extends Tool {

    private _rect:GrRectangle;
    private _x1:number;
    private _y1:number;
    private _firstSnap: SnapInfo;
    private _secondSnap: SnapInfo;

    constructor(renderer) {
        super(renderer);
        this.setWaitDoneStates(States.Wait, States.Done);

        this._state.add(state(States.Wait), InteractionEvents.Click, state(States.FirstPoint));
        this._state.add(state(States.FirstPoint), InteractionEvents.MouseMove, state(States.DragSize));
        this._state.add(state(States.DragSize), InteractionEvents.MouseMove, state(States.DragSize));
        this._state.add(state(States.DragSize), InteractionEvents.Click, state(States.Done));
        this._state.start(state(States.Wait));

        this.enablePOISnapping();
    }

    public reset() {
        super.reset();
        this._rect = null;
    }

    protected _update(interactionEvent: InteractionEvents, snapInfo: SnapInfo = null): boolean {
        let eventData = snapInfo.event;

        if (interactionEvent === InteractionEvents.Cancel) {
            this.reset();
            return false;
        }

        let calcRect;

        this._state.next(interactionEvent);

        switch (this._state.state.id) {
            case States.FirstPoint:
                this._x1 = eventData.x
                this._y1 = eventData.y
                this._firstSnap = snapInfo;
                this._rect = GrRectangle.create(null, eventData.x, eventData.y, 0, 0);
                this._renderer.renderRectangle(RenderLayer.Interaction, this._rect, false);
                break;

            case States.Done: // pass through
            case States.DragSize:
                calcRect = this._calculateRect(eventData.x, eventData.y)
                this._rect.x = calcRect.x1 + calcRect.w / 2;
                this._rect.y = calcRect.y1 + calcRect.h / 2;
                this._secondSnap = snapInfo;
                this._rect.width = calcRect.w;
                this._rect.height = calcRect.h;
                this._renderer.renderRectangle(RenderLayer.Interaction, this._rect, false);
                break;

        }

        if (this._state.state.id === States.Done) {
            this._renderer.remove(this._rect);
        }

        return this.isDone;
    }

    protected _calculateRect(x2: number, y2: number) {
        const x1 = Math.min(this._x1, x2);
        const y1 = Math.min(this._y1, y2);
        const w = Math.max(this._x1, x2) - x1;
        const h = Math.max(this._y1, y2) - y1;
        return {x1, y1, w, h}
    }

    public get result(): any {

        let opcode: string;

        let one;
        let two;
        let p1: Point2D;
        let p2: Point2D;

        // These are not necessarily the actual point used because of snapping.
        // We use this find out where the first point lies, i.e. if it is top left, bottom right, etc...
        p1 = new Point2D(this._firstSnap.event.x, this._firstSnap.event.y)
        p2 = new Point2D(this._secondSnap.event.x, this._secondSnap.event.y)

        if (p1.x < p2.x) {
            if (p1.y < p2.y) opcode = AppConfig.Runtime.Opcodes.Rect.TopLeftWH
            else opcode = AppConfig.Runtime.Opcodes.Rect.BottomLeftWH
        } else {
            if (p1.y < p2.y) opcode = AppConfig.Runtime.Opcodes.Rect.TopRightWH
            else opcode = AppConfig.Runtime.Opcodes.Rect.BottomRightWH
        }

        one = this.makePointCodeFromSnapInfo(this._firstSnap);
        if (this._secondSnap.object) {
            opcode = AppConfig.Runtime.Opcodes.Rect.PointPoint
            two = this.makePointCodeFromSnapInfo(this._secondSnap);
        } else {
            two = `${this.makeCodeForNumber(this._rect.width)}, ${this.makeCodeForNumber(this._rect.height)}`;
        }

        return `${opcode} ${this._rect.uniqueName}, ${AppConfig.Runtime.defaultStyleRegisterName}, ${one}, ${two}`;
    }

}