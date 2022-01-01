import {state} from "../../../runtime/tools/StateMachine";
import {InteractionEventData, InteractionEvents} from "../InteractionEvents";
import {Tool} from "./Tool";
import {RenderLayer} from "../Objects/ObjectRenderer";
import {GrRectangle} from "../Objects/GrRectangle";

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

    constructor(renderer) {
        super(renderer, States.Wait, States.Done);

        this._state.add(state(States.Wait), InteractionEvents.Click, state(States.FirstPoint));
        this._state.add(state(States.FirstPoint), InteractionEvents.MouseMove, state(States.DragSize));
        this._state.add(state(States.DragSize), InteractionEvents.MouseMove, state(States.DragSize));
        this._state.add(state(States.DragSize), InteractionEvents.Click, state(States.Done));
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
            case States.FirstPoint:
                this._x1 = eventData.x
                this._y1 = eventData.y
                this._rect = GrRectangle.create(null, eventData.x, eventData.y, 0, 0);
                this._renderer.renderRectangle(RenderLayer.Interaction, this._rect);
                break;

            case States.Done: // pass through
            case States.DragSize:
                calcRect = this._calculateRect(eventData.x, eventData.y)
                this._rect.x = calcRect.x1 + calcRect.w / 2;
                this._rect.y = calcRect.y1 + calcRect.h / 2;
                this._rect.width = calcRect.w;
                this._rect.height = calcRect.h;
                this._renderer.renderRectangle(RenderLayer.Interaction, this._rect);
                break;

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
        if (!this.isDone) {
            return null;
        } else {
            return this._rect;
        }
    }

    get code(): string {
        return `RECT $drawing ${this._rect.name} "${this._rect.name}" $styles.default (${this._rect.x} ${this._rect.y}) ${this._rect.width} ${this._rect.height}`
    }

}