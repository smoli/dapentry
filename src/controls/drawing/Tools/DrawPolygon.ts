import {state} from "../../../runtime/tools/StateMachine";
import {InteractionEventData, InteractionEvents} from "../InteractionEvents";
import {Tool} from "./Tool";
import {RenderLayer} from "../Objects/ObjectRenderer";
import {GrPolygon, GrPolygonBase} from "../../../Geo/GrPolygon";
import {Point2D} from "../../../Geo/Point2D";

enum States {
    Wait = "DrawPolygon.Wait",
    Drag = "DrawPolygon.Drag",
    FirstPoint = "DrawPolygon.FirstPoint",
    Point = "DrawPolygon.Point",
    Done = "DrawPolygon.Done",
}

export class DrawPolygon extends Tool {

    private _poly: GrPolygonBase;
    protected _objectClass: any = GrPolygon;
    private _closed: boolean;
    protected _renderMethod: any;
    protected _opCode: string;
    protected _extending: boolean;
    private _originalPolyLength: number;

    constructor(renderer) {
        super(renderer, States.Wait, States.Done);

        this._state.add(state(States.Wait), InteractionEvents.Click, state(States.FirstPoint));
        this._state.add(state(States.FirstPoint), InteractionEvents.Click, state(States.Drag));
        this._state.add(state(States.Drag), InteractionEvents.Click, state(States.Point));
        this._state.add(state(States.Point), InteractionEvents.Click, state(States.Drag));
        this._state.add(state(States.Drag), InteractionEvents.AlternateClick, state(States.Done));
        this._state.add(state(States.Wait), InteractionEvents.AlternateClick, state(States.Done));

        this._renderMethod = renderer.renderPolygon.bind(renderer);
        this._opCode = "POLY";

        this._state.start(state(States.Wait));
    }

    public reset() {
        super.reset();
        this._poly = null;
        this._extending = false;
    }

    protected handleInteractionOnWait(interactionEvent: InteractionEvents, eventData: InteractionEventData) {
        if (!this._poly) {
            return;
        }

        let newp: Point2D;
        newp = new Point2D(eventData.x, eventData.y);
        switch (interactionEvent) {
            case InteractionEvents.MouseMove:
                this._poly.setPoint(this._poly.points.length - 1, newp);
                this._renderMethod(RenderLayer.Interaction, this._poly);
                break;

            case InteractionEvents.Key:
                if (eventData.key === "Backspace") {
                    console.log(eventData)
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

    protected handlePointState(interactionEvent: InteractionEvents, eventData: InteractionEventData = null, first: boolean) {
        let newp: Point2D;

        if (interactionEvent == InteractionEvents.Click) {
            newp = new Point2D(eventData.x, eventData.y);

            if (!this._poly) {
                this._poly = this._objectClass.create(null, [newp], false);
            } else {
                this._poly.setPoint(this._poly.points.length - 1, newp);
            }

            // Add a point for dragging
            this._poly.addPoint(newp);
            this._renderMethod(RenderLayer.Interaction, this._poly);
            this._state.next(InteractionEvents.Click);
        }
    }

    public update(interactionEvent: InteractionEvents, eventData: InteractionEventData = null): boolean {

        if (interactionEvent === InteractionEvents.Selection) {
            if (eventData.selection &&
                eventData.selection.length === 1 &&
                eventData.selection[0] instanceof GrPolygon &&
                eventData.selection[0] !== this._poly) {
                this._extending = true;
                this._poly = eventData.selection[0];
                this._originalPolyLength = this._poly.points.length;
                this._state.start(state(States.Point));

                // add a point for dragging

                this._poly.addPoint(this._poly.points[this._originalPolyLength - 1])
                this._state.next(InteractionEvents.Click);

            }

        }


        if (interactionEvent === InteractionEvents.Cancel) {
            this.reset();
            return false;
        }

        this._state.next(interactionEvent);

        switch (this._state.state.id) {

            case States.Wait:
            case States.Drag:
                this.handleInteractionOnWait(interactionEvent, eventData);
                break;

            case States.FirstPoint:
                this.handlePointState(interactionEvent, eventData, true);
                break;

            case States.Point:
                this.handlePointState(interactionEvent, eventData, false);
                break;

            case States.Done:
                if (!this._poly) {
                    break;
                }
                this._poly.removeLastPoint();
                if (eventData.shift) {
                    this._closed = false;
                } else {
                    this._closed = true;
                }
                break;

        }

        return this.isDone;
    }

    public get result(): any {
        if (this._poly && this._poly.points.length > 0) {
            if (!this._extending) {
                return `${this._opCode} ${this._poly.uniqueName}, $styles.default, [ ${this._poly.points.map(p => `(${p.x}, ${p.y})`).join(", ")} ], ${this._closed ? 1 : 0}`;
            } else {
                const points = this._poly.points.filter((p, i) => i >= this._originalPolyLength);
                return `EXTPOLY ${this._poly.uniqueName}, [ ${points.map(p => `(${p.x}, ${p.y})`).join(", ")} ]`
            }

        } else {
            return null;
        }
    }

}

