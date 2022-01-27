import {InteractionEventData, InteractionEvents} from "../InteractionEvents";
import {SnapInfo, Tool} from "./Tool";
import {ObjectRenderer} from "../Objects/ObjectRenderer";
import {GrObject, POI, POIMap, POIPurpose} from "../../../Geo/GrObject";
import {state} from "../../../runtime/tools/StateMachine";
import {rad2deg} from "../../../Geo/GeoMath";
import {Point2D} from "../../../Geo/Point2D";


enum States {
    Wait = "RotateTool.Wait",
    Done = "RotateTool.Done",
    Cancel = "RotateTool.Cancel",
    Handle = "RotateTool.Handle"
}

enum Events {
    HandleDown = "RotateTool.HandleDown"
}


export class RotateTool extends Tool {

    protected _selection: Array<GrObject> = [];
    private _startVector: Point2D;
    private _finalAngle: number = 0;
    private _rotationObject: GrObject;
    private _rotationPoi: POI;
    private _pivotPoi: POI;
    private _pivotPoint: Point2D;

    constructor(renderer: ObjectRenderer) {
        super(renderer);
        this.setWaitDoneStates(States.Wait, States.Done);

        this._state.add(state(States.Wait), Events.HandleDown, state(States.Handle));
        this._state.add(state(States.Handle), InteractionEvents.MouseUp, state(States.Done));

        this._state.add(state(States.Handle), InteractionEvents.Cancel, state(States.Cancel));

        this._state.start(state(States.Wait));
    }

    abort() {
        if (this._object) {
            this._renderer.removeAllHandles(this._object);
        }
        super.abort();
    }

    finish() {
        super.finish();
        if (!this._object) {
            return;
        }
        this._renderer.removeAllHandles(this._object);
    }

    initialize() {
        if (!this._object) {
            return;
        }
        this._finalAngle = 0;
        const poi: POIMap = this._object.pointsOfInterest(POIPurpose.MANIPULATION);
        Object.keys(poi)
            .forEach(poiId => {
                console.log(POI[poiId], poi[poiId])
                this._renderer.renderHandle(this._object, poiId, poi[poiId], this._onHandleEvent.bind(this), Number(poiId));
            });

        this._renderer.renderBoundingRepresentation(this._object);
    }

    protected _onHandleEvent(object: GrObject, eventData: InteractionEventData, poiId): void {

        if (eventData.interactionEvent === InteractionEvents.MouseDown) {
            const poi = this._object.pointsOfInterest(POIPurpose.MANIPULATION)[poiId];
            this._rotationPoi = Number(poiId);
            this._pivotPoi = this._object.getOppositePoi(this._rotationPoi);
            this._pivotPoint = this._object.pointsOfInterest(POIPurpose.MANIPULATION)[this._pivotPoi];

            this._rotationObject = this._object.createProxy();

            this._startVector = poi.copy.sub(this._object.center);
            this._finalAngle = 0;
            this._state.next(Events.HandleDown);
        }
    }

    set selection(value: Array<GrObject>) {
        this.finish();
        this.reset();
        this._selection = value;
        this.initialize();
    }

    protected get _object(): GrObject {
        return this._selection.length && this._selection[0];
    }

    protected _update(interactionEvent: InteractionEvents, snapInfo: SnapInfo = null): boolean {
        let eventData = snapInfo.event;
        this._state.next(interactionEvent);

        if (interactionEvent === InteractionEvents.Selection) {
            this.selection = eventData.selection;
        }

        switch (this._state.state.id as States) {
            case States.Wait:
                break;

            case States.Cancel:
                if (this._object) {
                    this._renderer.render(this._object, true);
                }
                break;

            case States.Done:
                const vector = new Point2D(eventData.x - this._rotationObject.center.x, eventData.y - this._rotationObject.center.y);

                let a = vector.angleTo(this._startVector);
                a = rad2deg(a);
                this._rotationObject.rotatePOI(this._rotationPoi, a);
                this._renderer.render(this._rotationObject, true);
                this._finalAngle += a;
                this._object.rotate(this._finalAngle);
                this._rotationObject = null;
                return true;

            case States.Handle:
                if (interactionEvent === InteractionEvents.MouseMove) {
                    const vector = new Point2D(eventData.x - this._rotationObject.center.x, eventData.y - this._rotationObject.center.y);

                    let a = vector.angleTo(this._startVector);
                    a = rad2deg(a);
                    this._rotationObject.rotatePOI(this._rotationPoi, a)
                    this._startVector = vector;
                    this._finalAngle += a;

                    this._renderer.render(this._rotationObject, true);

                    const poi: POIMap = this._rotationObject.pointsOfInterest(POIPurpose.MANIPULATION);

                    Object.keys(poi)
                        .forEach(poiId => {
                            this._renderer.updateHandle(this._rotationObject, poiId, poi[poiId]);
                        })
                }
                break;
        }


        return false;
    }

    public get result(): any {
        if (this._pivotPoint) {
            return `ROTATE ${this._object.name}, ${this._finalAngle}, ${this._object.name}@${POI[this._pivotPoi]}`
        } else {
            return `ROTATE ${this._object.name}, ${this._finalAngle}`
        }

    }
}
