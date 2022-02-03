import {InteractionEventData, InteractionEvents} from "../controls/drawing/InteractionEvents";
import {SnapInfo, Tool} from "./Tool";
import {ObjectRenderer} from "../controls/drawing/Objects/ObjectRenderer";
import {GrObject, POI, POIMap, POIPurpose, ScaleMode} from "../Geo/GrObject";
import {state} from "../runtime/tools/StateMachine";
import {Point2D} from "../Geo/Point2D";
import {eq} from "../Geo/GeoMath";

enum States {
    Wait = "MoveTool.Wait",
    Done = "MoveTool.Done",
    Handle = "MoveTool.Handle"
}

enum Events {
    HandleDown = "MoveTool.HandleDown"
}


export class ScaleTool extends Tool {

    protected _scaleMode: ScaleMode = ScaleMode.NONUNIFORM;
    protected _selection: Array<GrObject> = [];
    protected _scalingObject: GrObject = null;
    protected _scalingPOI: POI = null;
    protected _finalX: number;
    protected _finalY: number;

    private _op: Point2D;
    private _pivot: Point2D;
    private _pivotPOI: POI;

    constructor(renderer: ObjectRenderer) {
        super(renderer);
        this.setWaitDoneStates(States.Wait, States.Done);

        this._state.add(state(States.Wait), Events.HandleDown, state(States.Handle));
        this._state.add(state(States.Handle), InteractionEvents.MouseUp, state(States.Done));
        this._state.start(state(States.Wait));
    }

    abort() {
        if (this._object) {
            this._renderer.removeAllHandles(this._object);
        }
        super.abort();
    }

    initialize() {
        if (!this._object) {
            return;
        }
        const poi: POIMap = this._object.pointsOfInterest(POIPurpose.SCALING);

        Object.keys(poi)
            .forEach(poiId => {
                this._renderer.renderHandle(this._object, poiId, poi[poiId], this._onHandleEvent.bind(this), Number(poiId));
            })

        this._renderer.renderBoundingRepresentation(this._object);
    }

    protected _onHandleEvent(object: GrObject, eventData: InteractionEventData, poiId): void {

        if (eventData.interactionEvent === InteractionEvents.MouseDown && poiId !== POI.center) {
            this._state.next(Events.HandleDown);
            this._scalingObject = object.createProxy();

            this._scaleMode = this._scalingObject.supportedScaleModes[0];

            this._scalingPOI = poiId;
            this._pivotPOI = object.getOppositePoi(this._scalingPOI);
            this._pivot = this._scalingObject.pointsOfInterest(POIPurpose.SCALING)[this._pivotPOI];
            this._op = this._scalingObject.pointsOfInterest(POIPurpose.SCALING)[this._scalingPOI].copy.sub(this._scalingObject.center);
            this._finalX = 1;
            this._finalY = 1;
        }
    }

    set selection(value: Array<GrObject>) {
        if (this._object) {
            this._renderer.removeAllHandles(this._object);
        }

        this.finish()
        this.reset();

        this._selection = value;
        this.initialize();
    }

    protected get _object(): GrObject {
        return this._selection.length && this._selection[0];
    }

    protected _scale(dx, dy) {
        let oldPosition = this._scalingObject.pointsOfInterest(POIPurpose.SCALING)[this._scalingPOI];
        let newPosition = oldPosition.copy;
        newPosition.x += dx;
        newPosition.y += dy;

        const ol = this._scalingObject.mapPointToLocal(oldPosition);
        const nl = this._scalingObject.mapPointToLocal(newPosition);
        const pl = this._scalingObject.mapPointToLocal(this._pivot);

        const oldDx = ol.x - pl.x;
        const oldDy = ol.y - pl.y;

        const newDx = nl.x - pl.x;
        const newDy = nl.y - pl.y;

        let fx = eq(oldDx, 0) ? 1 : newDx / oldDx;
        let fy = eq(oldDy, 0) ? 1: newDy / oldDy;

        if (this._scaleMode === ScaleMode.UNIFORM) {
            fx = fy = Math.min(fx, fy);
        }

        this._scalingObject.scale(Math.abs(fx), Math.abs(fy), this._pivot);

        this._finalX *= Math.abs(fx);
        this._finalY *= Math.abs(fy);
    }

    protected _update(interactionEvent: InteractionEvents, snapInfo: SnapInfo = null): boolean {
        let eventData = snapInfo.event;
        this._state.next(interactionEvent);

        if (interactionEvent === InteractionEvents.Selection) {
            this.selection = eventData.selection;
        }

        let dx;
        let dy;



        if (this._object && this._scalingPOI !== null) {
            const thePOI = this._scalingObject.pointsOfInterest(POIPurpose.SCALING)[this._scalingPOI].copy;
            dx = eventData.x - thePOI.x;
            dy = eventData.y - thePOI.y;
        } else {
            return;
        }

        switch (this._state.state.id as States) {
            case States.Wait:
                this._scalingPOI = this._scalingObject = null;
                break;

            case States.Done:
                this._scale(dx, dy);
                return true;

            case States.Handle:
                if (interactionEvent === InteractionEvents.MouseMove) {
                    this._scale(dx, dy);
                    this._renderer.render(this._scalingObject, true);
                    const poi: POIMap = this._scalingObject.pointsOfInterest(POIPurpose.SCALING);
                    Object.keys(poi)
                        .forEach(poiId => {
                            this._renderer.updateHandle(this._scalingObject, poiId, poi[poiId]);
                        })

                }
                break;
        }
        return false;
    }

    public get result(): any {
        if (this._scaleMode == ScaleMode.UNIFORM) {
            return `SCALE ${this._object.name}, ${this.makeCodeForNumber(Math.abs(this._finalX))}, "${POI[this._pivotPOI]}"`
        } else {
            return `SCALE ${this._object.name}, ${this.makeCodeForNumber(Math.abs(this._finalX))}, ${this.makeCodeForNumber(Math.abs(this._finalY))}, "${POI[this._pivotPOI]}"`
        }
    }
}