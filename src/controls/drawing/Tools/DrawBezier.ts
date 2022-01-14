import {state} from "../../../runtime/tools/StateMachine";
import {InteractionEventData, InteractionEvents} from "../InteractionEvents";
import {Tool} from "./Tool";
import {RenderLayer} from "../Objects/ObjectRenderer";
import {Point2D} from "../../../Geo/GeoMath";
import {GrPolygon, GrPolygonBase} from "../../../Geo/GrPolygon";

enum States {
    Wait = "DrawPolygon.Wait",
    Point = "DrawPolygon.Point",
    Done = "DrawPolygon.Done",
}

export class DrawBezier extends Tool {

    private _poly: GrPolygonBase;
    protected _objectClass: any = GrPolygon;
    private _closed: boolean;
    protected _renderMethod: any;
    protected _opCode: string;

    constructor(renderer) {
        super(renderer, States.Wait, States.Done);

        this._state.add(state(States.Wait), InteractionEvents.MouseDown, state(States.Point));
        this._state.add(state(States.Point), InteractionEvents.MouseMove, state(States.Point));
        this._state.add(state(States.Point), InteractionEvents.MouseUp, state(States.Wait));
        this._state.add(state(States.Wait), InteractionEvents.AlternateClick, state(States.Done));

        this._renderMethod = renderer.renderPolygon.bind(renderer);
        this._opCode = "POLY";

        this._state.start(state(States.Wait));
    }

    public reset() {
        super.reset();
        this._poly = null;
    }

    protected handleInteractionOnWait(interactionEvent: InteractionEvents, eventData: InteractionEventData) {
        if (!this._poly) {
            return;
        }

        let newp: Point2D;
        newp = new Point2D(eventData.x, eventData.y);
        switch (interactionEvent) {
            case InteractionEvents.MouseDown:
                if (!this._poly) {
                    this._poly = GrPolygon.create(null, [newp, newp, newp], false);
                } else {
                    this._poly.addPoint(newp);
                    this._poly.addPoint(newp);
                    this._poly.addPoint(newp);
                }
                this._renderMethod(RenderLayer.Interaction, this._poly);
                break;

            case InteractionEvents.Key:
                if (eventData.key === "Backspace") {
                    this._poly.removeLastPoint();
                    if (this._poly.points.length === 0) {
                        this._poly = null;
                    } else {
                        newp = new Point2D(eventData.x, eventData.y);
                        this._poly.setPoint(this._poly.points.length - 1, newp);
                        this._renderer.remove(this._poly);
                    }
                }
        }
    }

    protected handlePointState(interactionEvent: InteractionEvents, eventData: InteractionEventData = null) {
        let newp: Point2D;
        newp = new Point2D(eventData.x, eventData.y);

        switch (interactionEvent) {
            case InteractionEvents.MouseMove:
                let i = this._poly.points.length - 2;
                const p2 = this._poly.points[i--];
                const p1 = this._poly.points[i--];

                const d = newp.copy.sub(p2);
                p1.sub(d);
                this._poly.removeLastPoint();
                this._poly.addPoint(newp);
                this._renderMethod(RenderLayer.Interaction, this._poly);

                break;

            case InteractionEvents.MouseUp:

                break;
        }
    }

    public update(interactionEvent: InteractionEvents, eventData: InteractionEventData = null): boolean {

        if (interactionEvent === InteractionEvents.Cancel) {
            this.reset();
            return false;
        }


        this._state.next(interactionEvent);

        let newp: Point2D;

        switch (this._state.state.id) {

            case States.Wait:
                this.handleInteractionOnWait(interactionEvent, eventData);
                break;

            case States.Point:
                this.handlePointState(interactionEvent, eventData);
                break;

            case States.Done:
                if (!this._poly) {
                    break;
                }
                if (eventData.shift) {
                    this._closed = false;
                } else {
                    this._closed = true;
                    this._poly.removeLastPoint();
                }
                break;

        }

        return this.isDone;
    }

    public get result(): any {
        if (this._poly && this._poly.points.length > 1) {
            return `${this._opCode} ${this._poly.uniqueName}, $styles.default, [ ${this._poly.points.map(p => `(${p.x}, ${p.y})`).join(", ")} ], ${this._closed ? 1 : 0}`
        } else {
            return null;
        }
    }

}

